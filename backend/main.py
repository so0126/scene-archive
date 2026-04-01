from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()

from bookprintapi import Client
app = FastAPI()


client = Client()

@app.get("/")
def root():
    return {"message": "API Key 로드 성공!"}