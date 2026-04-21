from fastapi import FastAPI
from pydantic import BaseModel
import os
from supabase import create_client
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

app = FastAPI()

# Credentials from Vercel Environment Variables
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

class ChatRequest(BaseModel):
    message: str

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:       
        # Initialize Embeddings inside the request to ensure fresh connection
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            transport="rest",
            google_api_key=GOOGLE_API_KEY
        )

        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

        vector_store = SupabaseVectorStore(
            client=supabase_client,
            embedding=embeddings,
            table_name="legal_documents",
            query_name="match_documents"
        )
        
        # Pull 4 relevant snippets
        retriever = vector_store.as_retriever(search_kwargs={"k": 4})
        
        # Initialize LLM
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash", 
            transport="rest", 
            google_api_key=GOOGLE_API_KEY
        )

        template = """You are the LexPrompt AI Tutor for Singapore Law. 
        Your ONLY source of truth is the provided CONTEXT.

        STRICT RULES:
        1. Base your answer EXCLUSIVELY on the provided CONTEXT.
        2. If the answer is not in the CONTEXT, say: "Based on the provided statutory references, I cannot find the specific provision..."
        3. Always cite Section numbers found in the CONTEXT.
        
        CONTEXT: {context}
        QUESTION: {question}
        ANSWER:"""

        prompt = PromptTemplate.from_template(template)

        # Build the engine
        lexprompt_engine = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | prompt | llm | StrOutputParser()
        )
        
        # 1. Get docs for the sidebar
        docs = retriever.invoke(request.message)
        sources = [{"content": d.page_content, "page": d.metadata.get("page", "N/A")} for d in docs]
        
        # 2. Get AI answer
        answer = lexprompt_engine.invoke(request.message)
        
        return {
            "answer": answer,
            "sources": sources
        }

    except Exception as e:
        # This will show up in your Vercel Dashboard Logs
        print(f"CRITICAL ERROR: {str(e)}")
        
        if "429" in str(e):
            return {"answer": "Quota reached. Please wait 30 seconds."}
        
        # Return the actual error to the UI temporarily so you can see it
        return {"answer": f"Technical snag: {str(e)}"}
