FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install torch torchvision torchaudio
RUN apt-get -y update
RUN apt-get install ffmpeg libsm6 libxext6 -y
COPY . .
EXPOSE 3003
CMD uvicorn --host 0.0.0.0 --port 3003 main:app
