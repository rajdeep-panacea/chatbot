# uvicorn main:app (to run the uvicorn server without the reload and it is used for build and in production)
#uvicorn main:app --reload (to run the uvicorn server with the reload and it is used in dev mode)

#main imports

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware 
from fastapi import Response
from decouple import config
import openai 

# Custom Function Imports
from functions.openai_requests import convert_audio_to_text, get_chat_response
from functions.database import store_messages, reset_messages
from functions.text_to_speech import convert_text_to_speech


# Get Environment Vars
openai.organization = config("OPEN_AI_ORG")
openai.api_key = config("OPEN_AI_KEY")

# Initiate App
app = FastAPI()

# CORS - Origins
origins = [
    "https://localhost:5173",
    "https://localhost:5174",
    "https://localhost:4173",
    "https://localhost:4174",
    "https://localhost:3000",
]

#CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins = "http://localhost:5173",
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Check Health
@app.get("/health")
async def check_health():
    return {"message": "Healthy"}

#Reset
@app.get("/reset")
async def reset_conversation():
    reset_messages()
    return {"message": "conversation reset"}


# #Post Bot Response
# #Note: Not playing in browser when using post request
@app.post("/post-audio/")
async def post_audio(file: UploadFile = File(...)):

    # #Get saved audio
    # audio_input = open("voice.mp3", "rb")

    #Save file from the frontend
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    audio_input = open(file.filename,"rb")
    #decode audio
    message_decoded = convert_audio_to_text(audio_input)

    #Guard: Ensure the message is decoded
    if not message_decoded:
        return HTTPException(status_code=400, detail="Failed to decode audio")
    
    #Get Chat gpt response
    chat_response = get_chat_response(message_decoded)
    print(chat_response)

    #Guard: Ensure there is chat response
    if not chat_response:
        return HTTPException(status_code=400, detail="Failed to get chat response")
    

    #Convert the chat response to audio
    audio_output = convert_text_to_speech(chat_response)

    #Guard: Ensure message decoded
    if not audio_output:
        return HTTPException(status_code=400, detail="Failed to get Eleven Labs audio response")
    

    #Create a generator that yeilds chunks of data
    def iterfile():
        yield audio_output

    #return audio file
    # return StreamingResponse(iterfile(), media_type="audio/mpeg")
    return StreamingResponse(iterfile(), media_type="application/octet-stream")

# Add the new endpoint for returning text messages
@app.post("/post-audio-text/")
async def post_audio_text(file: UploadFile = File(...)):

    # Save file from the frontend
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    audio_input = open(file.filename, "rb")
    
    # Decode audio to text
    message_decoded = convert_audio_to_text(audio_input)

    # Guard: Ensure the message is decoded
    if not message_decoded:
        raise HTTPException(status_code=400, detail="Failed to decode audio")
    
    # Get chat GPT response
    chat_response = get_chat_response(message_decoded)
    print(chat_response)

    # Guard: Ensure there is a chat response
    if not chat_response:
        raise HTTPException(status_code=400, detail="Failed to get chat response")

    # Return the chat response as plain text
    return Response(content=chat_response, media_type="text/plain")