# Import what we need
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import librosa
from fastapi import FastAPI, UploadFile
from prometheus_fastapi_instrumentator import Instrumentator
from fastapi.middleware.cors import CORSMiddleware
from moviepy.editor import VideoFileClip
import os

app = FastAPI()
origins = [
    "http://ofsen.io:5173",
    "http://localhost:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Prometheus Metrics
Instrumentator().instrument(app).expose(app)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/transcribe/")
async def create_upload_file(file: UploadFile | None = None):
    if not file:
        return {"error": True, "message": "No upload file sent"}
    elif file.headers["content-type"] != "video/mp4" and file.headers["content-type"] != "audio/mp3" and file.headers["content-type"] != "audio/mpeg":
      return {"error": True, "message": "Invalid file type"}
    else:
      content = file.file.read()
      with open(file.filename, "wb+") as file_object:
        file_object.write(content)

      audioFile = None
      if file.headers["content-type"] == "video/mp4":
        video = VideoFileClip(f"{file.filename}")
        video.audio.write_audiofile(f"{file.filename}.mp3")
        video.close()
        audioFile = f"{file.filename}.mp3"
      else:
         audioFile = file.filename

      # Load the Whisper processor and model
      processor = WhisperProcessor.from_pretrained("openai/whisper-small")
      model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-small")

      # Load the audio file using librosa
      audio_data, _ = librosa.load(audioFile, sr=16000)

      # Process the audio and generate output
      input_features = processor.feature_extractor(audio_data, sampling_rate=16000, return_tensors="pt").input_features

      # With prompt
    #   prompt_ids = processor.get_prompt_ids("class of crimial", return_tensors="pt")
    #   print(prompt_ids)

      # generate token ids by running model forward sequentially
    #   predicted_ids = model.generate(input_features, prompt_ids=prompt_ids)
      predicted_ids = model.generate(input_features, return_timestamps=True)

      # post-process token ids to text
      transcription = processor.tokenizer.batch_decode(predicted_ids, skip_special_tokens=False)

      # Remove the audio file
      if file.headers["content-type"] == "video/mp4":
        os.remove(file.filename)
      os.remove(audioFile)

      return {"filename": file.filename, "transcription": transcription}
