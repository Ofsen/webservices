import { useState } from "react";
import { ImageUp } from "lucide-react";
import useAuth from "@/lib/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import env from "@/config/env";

const Uploader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  function handleUrlChange(e) {
    const url = e.target.value;
    console.log(url);
  }

  function handleFileChange(e) {
    e.preventDefault();
    const file = e.target.files?.[0];

    if (!user) {
      navigate("/auth/login?error=Please login to upload a video.");
    }

    if (file) {
      setLoading(true);
      setData(null);
      const formData = new FormData();
      formData.append("file", file);
      e.target.value = "";
      delete e.target.files[0];

      // upload file
      axios
        .post(env.ai + "/transcribe", formData)
        .then((data) => {
          if ("error" in data.data) {
            console.error(data.data.message);
          }
          const trimmedData = data.data.transcription[0]
            .replace("<|endoftext|>", "")
            .replace("<|startoftranscript|><|en|><|transcribe|> ", "");
          setData(trimmedData);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  function handleYoutubeTranscription(e) {
    e.preventDefault();
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!loading && data ? (
        <div className="mb-4">
          <h2 className="font-bold">Transcription</h2>
          <p>{data}</p>
        </div>
      ) : (
        <></>
      )}

      <label
        htmlFor="dropzone-file"
        className="flex flex-col p-1 items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-5 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {loading ? (
            <>
              <p>We are processing data, please wait...</p>
              <div className="loading loading-infinity loading-lg text-green-600"></div>
            </>
          ) : (
            <>
              <div className="animate-bounce">
                <ImageUp />
              </div>
              <p className="mb-2 text-sm">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs">MP4 or MP3</p>
            </>
          )}
        </div>

        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      <div className="divider pt-3">Or</div>
      <div className="form-control w-full">
        <div className="label">
          <label htmlFor="dropzone-url" className="label-text">
            Link to a video
          </label>
        </div>
        <div className="flex">
          <input
            id="dropzone-url"
            className="input input-bordered w-full rounded-e-none"
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            onChange={handleUrlChange}
          />
          <button
            className="btn btn-secondary rounded-s-none"
            onClick={handleYoutubeTranscription}
          >
            Give me subtitles!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
