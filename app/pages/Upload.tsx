"use client";

import { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaImage, FaDownload } from 'react-icons/fa';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processingPreview, setProcessingPreview] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // State for circle progress
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProcessingPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setProcessingPreview(null);
      setProgress(0);
    }
  }, [image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(null);
      setError(null);
      setProgress(0);
    }
  };

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
    formData.append('image', image);
    formData.append('percentage', percentage.toString());

    try {
      // Simulate progress updates (replace with actual upload progress if available)
      const intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 95) {
            return prevProgress + 5;
          }
          return prevProgress;
        });
      }, 300);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(intervalId); // Clear the simulation

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Upload failed: ${errorData?.message || response.statusText}`);
        return;
      }
      setImage(null)
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPreview(url);
      setProgress(100);
    } catch (err: unknown) {
      // Type guard to check if err is an instance of Error
      if (err instanceof Error) {
        setError(`An unexpected error occurred: ${err.message}`);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
      setProcessingPreview(null);
      setProgress(0);

    }
  };

  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen flex bg-gray-100 flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-lg shadow-lg p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            <FaImage className="inline-block mr-2" /> Image Compressor
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Upload an image and adjust the Size.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">
              Select Image
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {processingPreview && !preview && !error && loading && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Processing:
              </label>
              <div className="mt-2 rounded-md shadow-md overflow-hidden relative">
                <img

                  src={processingPreview}
                  alt="Processing Preview" className="w-full object-cover blur-sm" style={{ filter: 'blur(5px)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16">
                    <circle
                      cx={radius + 2}
                      cy={radius + 2}
                      r={radius}
                      stroke="#e0e0e0"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    <circle
                      cx={radius + 2}
                      cy={radius + 2}
                      r={radius}
                      stroke="#6366f1"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform={`rotate(-90 ${radius + 2} ${radius + 2})`}
                      style={{ transition: 'stroke-dashoffset 0.3s ease-in-out' }}
                    />
                    <text x={radius + 2} y={radius + 7} textAnchor="middle" className="text-sm text-gray-700 font-semibold">
                      {progress}%
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="percentage" className="block text-sm font-medium text-gray-700">
              Processing Percentage: {percentage}%
            </label>
            <input
              type="range"
              id="percentage"
              min="10"
              max="100"
              step="10"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <button
              onClick={handleUpload}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'cursor-not-allowed' : ''
                }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <FaCloudUploadAlt className="inline-block mr-2" /> Upload & Process
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {preview && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Processed Image:</h3>
              <div className="mt-2 rounded-md shadow-md overflow-hidden">
                <img
                  src={preview} // prepend the correct data URI type

                  alt="Processed Preview" className="w-full object-cover" />
              </div>
              <a
                href={preview}
                download="processed.jpg"
                className="inline-flex items-center mt-4 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaDownload className="mr-2" /> Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}