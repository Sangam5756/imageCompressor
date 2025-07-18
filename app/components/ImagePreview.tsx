'use client';

import { FaDownload } from 'react-icons/fa';

interface ImagePreviewProps {
  previewUrl: string;
}

export default function ImagePreview({ previewUrl }: ImagePreviewProps) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900">Processed Image:</h3>
      <img src={previewUrl} alt="Processed" className="mt-2 rounded shadow-md w-full" />
      <a
        href={previewUrl}
        download="processed.jpg"
        className="inline-flex items-center mt-4 px-4 py-2 bg-white border rounded-md text-sm hover:bg-gray-50"
      >
        <FaDownload className="mr-2" /> Download
      </a>
    </div>
  );
}
