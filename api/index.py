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

template = """You are the LexPrompt AI Legal Assistant for Singapore Law.
Your goal is to provide accurate, grounded explanations.

STRICT RULES:
1. Only answer using the provided CONTEXT. 
2. For EVERY claim you make, you MUST cite the specific Act and Section (e.g., "Under Section 34 of the Probate and Administration Act 1934...").
3. If the context does not contain the answer, say "I cannot find the specific statutory provision in my current database" and suggest what the user should look for.

CONTEXT:
{context}

QUESTION:
{question}

EXPLANATION WITH CITATIONS:"""

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
        # 1. Get the documents used for the answer
        docs = retriever.get_relevant_documents(request.message)
        sources = [doc.metadata for doc in docs]
        
        # 2. Get the AI's response
        response = lexprompt_engine.invoke(request.message)
        
        return {
            "answer": response,
            "sources": sources
        }
    except Exception as e:
        return {"error": str(e)}
