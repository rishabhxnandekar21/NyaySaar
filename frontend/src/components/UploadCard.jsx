import { Upload, Loader2 } from "lucide-react";

export default function UploadCard({
  hasUploaded,
  isUploading,
  fileName,
  handleUpload,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-5">Upload Court Judgment</h2>

      {!hasUploaded && !isUploading && (
        <label className="border-2 border-dashed border-slate-300 rounded-xl h-56 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
          <Upload className="text-blue-600 mb-3" size={42} />

          <p className="font-medium">Drag & Drop PDF</p>

          <p className="text-sm text-slate-500 mt-2">or click to browse</p>

          <p className="text-xs text-slate-400 mt-5">PDF • Maximum 10 MB</p>

          <input hidden type="file" accept=".pdf" onChange={handleUpload} />
        </label>
      )}

      {isUploading && (
        <div className="h-56 flex flex-col justify-center items-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={36} />

          <p className="font-medium">Processing Judgment...</p>

          <p className="text-sm text-slate-500 mt-2">
            Please wait while AI analyzes the document.
          </p>
        </div>
      )}

      {hasUploaded && !isUploading && (
        <div className="h-56 rounded-xl bg-green-50 border border-green-200 flex flex-col justify-center items-center px-6">
          <Upload className="text-green-600 mb-4" size={38} />

          <h3 className="font-semibold text-green-700 text-center">
            {fileName}
          </h3>

          <p className="text-sm text-slate-500 mt-2">Ready for AI Analysis</p>

          <label className="mt-5 cursor-pointer">
            <span className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition inline-block">
              Replace Document
            </span>

            <input hidden type="file" accept=".pdf" onChange={handleUpload} />
          </label>
        </div>
      )}
    </div>
  );
}
