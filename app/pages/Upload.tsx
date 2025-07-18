"use client";

import { useState, useEffect } from "react";
import UploadForm from "../components/UploadForm";
import ImagePreview from "../components/ImagePreview";
import ProgressCircle from "../components/ProgressCircle";
import ErrorAlert from "../components/ErrorAlert";

export default function UploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processingPreview, setProcessingPreview] = useState<string | null>(
    null
  );
  const [percentage, setPercentage] = useState<number>(50);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => setProcessingPreview(reader.result as string);
      reader.readAsDataURL(image);
    } else {
      setProcessingPreview(null);
    }
  }, [image]);

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image to upload.");
      return;
    }

    setLoading(true);
    setError(null);
    setPreview(null);
    setProgress(0);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("percentage", percentage.toString());

    try {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 95 ? prev + 5 : prev));
      }, 300);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      clearInterval(interval);

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Upload failed.");
        return;
      }

      const blob = await res.blob();
      setPreview(URL.createObjectURL(blob));
      setProgress(100);
      setImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
      setProcessingPreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="absolute top-4 right-4 z-50">
        <a
          href="https://github.com/Sangam5756/imageCompressor"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gradient-to-b from-[#a85c5c] via-[#a3d867] to-[#eb0404] px-4 py-1 rounded-md text-black text-sm shadow-md hover:opacity-90 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-github"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          Star us on GitHub
        </a>
      </div>
      <div className="min-h-screen  flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold  ">
              Image Compressor
            </h1>
            <span className="text-sm text-center ">Upload an image and adjust the</span>
          </div>

          <UploadForm
            loading={loading}
            percentage={percentage}
            onPercentageChange={setPercentage}
            onUpload={handleUpload}
            onImageChange={(e) => {
              if (e.target.files?.[0]) {
                setImage(e.target.files[0]);
                setPreview(null);
                setError(null);
                setProgress(0);
              }
            }}
          />

          {processingPreview && loading && (
            <div className="mt-6 relative">
              <img
                src={processingPreview}
                className="w-full rounded blur-sm"
                alt="Processing"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <ProgressCircle progress={progress} />
              </div>
            </div>
          )}

          {error && <ErrorAlert message={error} />}
          {preview && <ImagePreview previewUrl={preview} />}
        </div>
      </div>
    </div>
  );
}
