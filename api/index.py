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

# 1. SWITCH EMBEDDINGS TO GOOGLE (Lightweight API call, no heavy local files)
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    transport="rest"
)

supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 2. Point to the Store
vector_store = SupabaseVectorStore(
    client=supabase_client,
    embedding=embeddings,
    table_name="legal_documents",
    query_name="match_documents"
)
retriever = vector_store.as_retriever(search_kwargs={"k": 3})

# 3. Engine Setup (Same as before)
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", transport="rest")

template = """You are the LexPrompt AI Tutor for Singapore Law. 
Explain the law simply using the CONTEXT provided.
If the information is not in the CONTEXT, do not mention it.

CONTEXT: {context}
QUESTION: {question}
ANSWER WITH CITATIONS:"""

prompt = PromptTemplate.from_template(template)
def format_docs(docs): return "\n\n".join(doc.page_content for doc in docs)

lexprompt_engine = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt | llm | StrOutputParser()
)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # 1. Manually get the documents first so we can send them to the UI
        docs = retriever.invoke(request.message)
        
        # 2. Extract the source content and page numbers
        sources = []
        for doc in docs:
            sources.append({
                "content": doc.page_content,
                "page": doc.metadata.get("page", "N/A")
            })
        
        # 3. Get the AI's answer using the same logic
        answer = lexprompt_engine.invoke(request.message)
        
        return {
            "answer": answer,
            "sources": sources
        }
    except Exception as e:
        return {"error": str(e)}
