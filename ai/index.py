from fastapi import FastAPI
from pydantic import BaseModel
import os
from supabase import create_client
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

app = FastAPI()

# --- LAYER 1: CONFIGURATION ---
# In Vercel, use os.environ.get() to keep keys secret!
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

# --- LAYER 2: CONNECTION (No re-uploading here) ---
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

# We just "point" to the existing table you already filled in Colab
vector_store = SupabaseVectorStore(
    client=supabase_client,
    embedding=embeddings,
    table_name="legal_documents",
    query_name="match_documents"
)
retriever = vector_store.as_retriever(search_kwargs={"k": 3})

# --- LAYER 3: ENGINE ---
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    temperature=0.1, 
    transport="rest"
)

template = """You are the LexPrompt AI Tutor for Singapore Probate Law. 
Explain the law simply using the context provided.

CONTEXT: {context}
QUESTION: {question}
EXPLANATION:"""

prompt = PromptTemplate.from_template(template)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

lexprompt_engine = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# --- LAYER 4: API ENDPOINT ---
class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        response = lexprompt_engine.invoke(request.message)
        return {"answer": response}
    except Exception as e:
        return {"error": str(e)}
