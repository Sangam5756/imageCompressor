import { FaCloudUploadAlt } from "react-icons/fa";

interface UploadFormsProps {
  loading: boolean;
  percentage: number;
  onPercentageChange: (val: number) => void;
  onUpload: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadForm({
  loading,
  percentage,
  onPercentageChange,
  onUpload,
  onImageChange,
}: UploadFormsProps) {
  return (
    <>
      <label
        htmlFor="image-upload"
        className="block text-sm font-medium text-gray-700"
      >
        Select Image
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={onImageChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
      />
      <label
        htmlFor="percentage"
        className="block mt-4 text-sm font-medium text-gray-700"
      >
        Compression: {percentage}%
      </label>
      <input
        type="range"
        id="percentage"
        min="10"
        max="100"
        step="10"
        value={percentage}
        onChange={(e) => onPercentageChange(Number(e.target.value))}
        className="w-full mt-1"
      />

      <button
        onClick={onUpload}
        disabled={loading}
        className={`mt-4 w-full bg-indigo-600 text-white py-2 rounded-md ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
        }`}
      >
        {loading ? (
          "Processing..."
        ) : (
          <>
            <FaCloudUploadAlt className="inline mr-2" /> Upload & Process
          </>
        )}
      </button>
    </>
  );
}
