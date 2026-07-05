import { Loader2, Upload } from "lucide-react";

export default function AnalysisPanel({
  hasUploaded,
  summary,
  verdict,
  persona,
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">AI Analysis</h2>

          <p className="text-sm text-slate-500 mt-1">
            Automatically generated after upload
          </p>
        </div>

        {hasUploaded && (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            Ready
          </span>
        )}
      </div>

      {!hasUploaded ? (
        <div className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center px-8">
          <Upload size={42} className="text-slate-400 mb-5" />

          <h3 className="font-semibold text-lg">No Document Uploaded</h3>

          <p className="text-slate-500 mt-2 max-w-md">
            Upload a court judgment PDF to generate an AI-powered summary,
            verdict, and legal insights.
          </p>
        </div>
      ) : !summary ? (
        <div className="flex-1 flex flex-col justify-center items-center">
          <Loader2 className="animate-spin text-blue-600 mb-5" size={42} />

          <h3 className="font-semibold text-lg">Generating Analysis...</h3>

          <p className="text-slate-500 mt-2">
            This usually takes a few seconds.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
          {/* Verdict */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="text-sm text-slate-500 mb-2">Final Verdict</p>

            <h2 className="text-xl font-bold text-green-700">{verdict}</h2>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Summary</h3>

              <button
                onClick={() => navigator.clipboard.writeText(summary)}
                className="text-blue-600 text-sm hover:underline"
              >
                Copy
              </button>
            </div>

            <div className="leading-8 whitespace-pre-wrap text-slate-700">
              {summary}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs uppercase text-slate-400">Persona</p>

              <p className="font-semibold mt-2 capitalize">{persona}</p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs uppercase text-slate-400">Status</p>

              <p className="font-semibold mt-2 text-green-600">Completed</p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs uppercase text-slate-400">Document</p>

              <p className="font-semibold mt-2">PDF</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
