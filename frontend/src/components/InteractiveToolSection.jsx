import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  Loader2,
  Scale,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

const STAGES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  ANALYZING: "analyzing",
  COMPLETE: "complete",
};

const ANALYSIS_STEPS = [
  { label: "Parsing document structure", duration: 600 },
  { label: "Extracting legal entities", duration: 900 },
  { label: "Cross-referencing case law", duration: 700 },
  { label: "Generating summary", duration: 500 },
];

const mockSummary = {
  title: "Case No. 2024/CR/1847 — State vs. Ramesh Kumar",
  court: "Sessions Court, Delhi",
  date: "14 November 2024",
  verdict: "Acquitted",
  verdictType: "acquittal",
  summary:
    "The court found the defendant not guilty on all charges due to insufficient evidence from the prosecution. All bail conditions are revoked with immediate effect, and no restrictions remain on travel or employment.",
  keyPoints: [
    "Defendant acquitted of all charges",
    "Prosecution failed to establish proof beyond reasonable doubt",
    "Bail conditions revoked with immediate effect",
    "No restrictions on travel or employment",
  ],
  confidence: 97,
  pages: 12,
  readTime: "2 min",
};

// Verdict config map
const verdictConfig = {
  acquittal: {
    label: "Acquitted",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle,
  },
  convicted: {
    label: "Convicted",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    icon: AlertTriangle,
  },
};

function StepIndicator({ currentStep, steps }) {
  return (
    <div className="w-full max-w-sm mt-8 space-y-2.5">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              i < currentStep
                ? "bg-zinc-900"
                : i === currentStep
                  ? "border-2 border-zinc-900 bg-transparent"
                  : "border border-zinc-200 bg-transparent"
            }`}
          >
            {i < currentStep && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2.5 h-2.5 text-white"
                viewBox="0 0 10 10"
                fill="none"
              >
                <path
                  d="M2 5l2.5 2.5L8 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
            {i === currentStep && (
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="w-1.5 h-1.5 rounded-full bg-zinc-900"
              />
            )}
          </div>
          <span
            className={`text-xs transition-colors duration-300 ${
              i <= currentStep ? "text-zinc-700 font-medium" : "text-zinc-300"
            }`}
          >
            {step.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function MetaBadge({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-100 rounded-full px-3 py-1">
      <Icon className="w-3 h-3" strokeWidth={1.5} />
      {label}
    </span>
  );
}

export default function InteractiveToolSection() {
  const [stage, setStage] = useState(STAGES.IDLE);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Drive the step animation during ANALYZING
  useEffect(() => {
    if (stage !== STAGES.ANALYZING) return;
    setAnalysisStep(0);
    let step = 0;
    const timers = [];
    ANALYSIS_STEPS.forEach((s, i) => {
      const delay = ANALYSIS_STEPS.slice(0, i).reduce(
        (acc, x) => acc + x.duration,
        0,
      );
      timers.push(
        setTimeout(() => {
          step = i;
          setAnalysisStep(i);
        }, delay),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  const simulateUpload = useCallback((file) => {
    setFileName(file.name);
    setStage(STAGES.UPLOADING);
    setTimeout(() => setStage(STAGES.ANALYZING), 1000);
    const totalAnalysis =
      ANALYSIS_STEPS.reduce((a, s) => a + s.duration, 0) + 400;
    setTimeout(() => setStage(STAGES.COMPLETE), 1000 + totalAnalysis);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) simulateUpload(file);
    },
    [simulateUpload],
  );

  const handleFileInput = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) simulateUpload(file);
    },
    [simulateUpload],
  );

  const reset = () => {
    setStage(STAGES.IDLE);
    setFileName("");
    setAnalysisStep(0);
  };

  const vc = verdictConfig[mockSummary.verdictType] || verdictConfig.acquittal;

  return (
    <section
      data-testid="interactive-tool-section"
      className="py-24 sm:py-32 relative overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 60%, rgba(16,185,129,0.06) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 80% 30%, rgba(99,102,241,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-white/80 backdrop-blur text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Try It Now
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900 mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Experience AI legal analysis
          </h2>
          <p className="text-base text-zinc-400 max-w-md mx-auto">
            Upload any court order and get a plain-language breakdown in
            seconds.
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-white border border-zinc-200/80 shadow-[0_2px_40px_rgba(0,0,0,0.07)] rounded-3xl overflow-hidden">
            {/* Thin top accent stripe */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />

            <AnimatePresence mode="wait">
              {/* ─── IDLE ─── */}
              {stage === STAGES.IDLE && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="p-8 sm:p-12"
                >
                  <label
                    data-testid="upload-dropzone"
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    className={`relative flex flex-col items-center justify-center gap-6 border-2 border-dashed rounded-2xl p-12 sm:p-16 text-center cursor-pointer transition-all duration-300 group ${
                      dragActive
                        ? "border-indigo-400 bg-indigo-50/40"
                        : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/40 hover:bg-zinc-50/80"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileInput}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      data-testid="file-input"
                    />

                    {/* Upload icon with animated ring */}
                    <div className="relative">
                      <div
                        className={`absolute inset-0 rounded-full transition-all duration-500 ${dragActive ? "scale-110 opacity-100" : "scale-100 opacity-0 group-hover:opacity-60 group-hover:scale-105"} bg-indigo-100 blur-sm`}
                      />
                      <div className="relative w-16 h-16 rounded-2xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center">
                        <Upload
                          className={`w-7 h-7 transition-colors duration-300 ${dragActive ? "text-indigo-500" : "text-zinc-400 group-hover:text-zinc-600"}`}
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    <div>
                      <p
                        className="text-base font-semibold text-zinc-800 mb-1"
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                        }}
                      >
                        {dragActive
                          ? "Drop to analyse"
                          : "Upload your court order"}
                      </p>
                      <p className="text-sm text-zinc-400">
                        Drag & drop a PDF, or click to browse
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {["PDF", "Court orders", "Judgements", "Contracts"].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="text-xs text-zinc-400 bg-white border border-zinc-100 rounded-full px-3 py-1"
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>
                  </label>

                  {/* Demo CTA */}
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <div className="h-px flex-1 bg-zinc-100 max-w-[6rem]" />
                    <button
                      data-testid="demo-button"
                      onClick={() =>
                        simulateUpload({ name: "court_order_2024.pdf" })
                      }
                      className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-800 transition-colors"
                    >
                      Try a sample document
                      <ArrowRight
                        className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                        strokeWidth={2}
                      />
                    </button>
                    <div className="h-px flex-1 bg-zinc-100 max-w-[6rem]" />
                  </div>
                </motion.div>
              )}

              {/* ─── UPLOADING / ANALYZING ─── */}
              {(stage === STAGES.UPLOADING || stage === STAGES.ANALYZING) && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="p-12 sm:p-16 flex flex-col items-center justify-center min-h-[360px]"
                >
                  {/* Spinner with layered rings */}
                  <div className="relative mb-8">
                    <div className="w-20 h-20 rounded-full border border-zinc-100" />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-transparent border-t-zinc-800"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.9,
                        ease: "linear",
                      }}
                    />
                    <motion.div
                      className="absolute inset-2 rounded-full border border-transparent border-t-zinc-300"
                      animate={{ rotate: -360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {stage === STAGES.UPLOADING ? (
                        <Upload
                          className="w-6 h-6 text-zinc-500"
                          strokeWidth={1.5}
                        />
                      ) : (
                        <Scale
                          className="w-6 h-6 text-zinc-700"
                          strokeWidth={1.5}
                        />
                      )}
                    </div>
                  </div>

                  <p
                    className="text-xl font-semibold text-zinc-800 mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {stage === STAGES.UPLOADING
                      ? "Uploading document…"
                      : "Analysing with AI…"}
                  </p>
                  <p className="text-sm text-zinc-400 mb-2">{fileName}</p>

                  {stage === STAGES.ANALYZING && (
                    <StepIndicator
                      currentStep={analysisStep}
                      steps={ANALYSIS_STEPS}
                    />
                  )}

                  {stage === STAGES.UPLOADING && (
                    <div className="w-full max-w-xs mt-8 h-1 bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "45%" }}
                        transition={{ duration: 0.9, ease: "easeInOut" }}
                        className="h-full bg-zinc-800 rounded-full"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── COMPLETE ─── */}
              {stage === STAGES.COMPLETE && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="p-8 sm:p-10"
                >
                  {/* Result header */}
                  <div className="flex items-start justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle
                          className="w-5 h-5 text-emerald-600"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-800 truncate">
                          Analysis complete
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {fileName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Confidence pill */}
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {mockSummary.confidence}% confidence
                      </span>
                      <button
                        data-testid="reset-button"
                        onClick={reset}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-700 transition-colors px-3 py-1.5 rounded-full border border-zinc-200 hover:border-zinc-300"
                      >
                        <RotateCcw className="w-3 h-3" strokeWidth={2} />
                        Upload another
                      </button>
                    </div>
                  </div>

                  {/* Metadata row */}
                  <div className="flex flex-wrap gap-2 mb-7">
                    <MetaBadge icon={FileText} label={mockSummary.court} />
                    <MetaBadge icon={Scale} label={mockSummary.date} />
                    <MetaBadge
                      icon={FileText}
                      label={`${mockSummary.pages} pages`}
                    />
                    <MetaBadge
                      icon={Sparkles}
                      label={`${mockSummary.readTime} read`}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                    {/* Left column: Summary + Verdict */}
                    <div className="lg:col-span-3 space-y-4">
                      {/* Summary card */}
                      <div
                        data-testid="summary-card"
                        className="bg-zinc-50 rounded-2xl p-6"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 block mb-3">
                          Summary
                        </span>
                        <h4
                          className="text-base font-semibold text-zinc-900 mb-3 leading-snug"
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                          }}
                        >
                          {mockSummary.title}
                        </h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          {mockSummary.summary}
                        </p>
                      </div>

                      {/* Verdict card */}
                      <motion.div
                        data-testid="verdict-card"
                        initial={{ scale: 0.97, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: 0.2,
                          duration: 0.4,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className={`rounded-2xl p-5 border flex items-center gap-4 ${vc.bg} ${vc.border}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl ${vc.bg} border ${vc.border} flex items-center justify-center flex-shrink-0`}
                        >
                          <vc.icon
                            className={`w-5 h-5 ${vc.color}`}
                            strokeWidth={1.5}
                          />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-0.5">
                            Verdict
                          </p>
                          <p
                            className={`text-2xl font-bold ${vc.color}`}
                            style={{
                              fontFamily: "'Playfair Display', Georgia, serif",
                            }}
                          >
                            {vc.label}
                          </p>
                        </div>
                        {/* Decorative dot */}
                        <div
                          className={`ml-auto w-2.5 h-2.5 rounded-full ${vc.dot} opacity-60 animate-pulse`}
                        />
                      </motion.div>
                    </div>

                    {/* Right column: Key Points */}
                    <div
                      data-testid="key-points-card"
                      className="lg:col-span-2 bg-zinc-900 rounded-2xl p-6 text-white"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 block mb-4">
                        Key Points
                      </span>
                      <div className="space-y-3">
                        {mockSummary.keyPoints.map((point, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.3 + i * 0.12,
                              duration: 0.35,
                            }}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-0.5 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                              <CheckCircle
                                className="w-3 h-3 text-emerald-400"
                                strokeWidth={2}
                              />
                            </div>
                            <p className="text-sm text-zinc-300 leading-relaxed">
                              {point}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      {/* CTA */}
                      <motion.button
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-white text-zinc-900 text-sm font-semibold rounded-xl py-2.5 hover:bg-zinc-100 transition-colors"
                      >
                        View full report
                        <ArrowRight className="w-4 h-4" strokeWidth={2} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            {[
              "End-to-end encrypted",
              "No data stored",
              "Built for Indian courts",
            ].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400"
              >
                <CheckCircle
                  className="w-3.5 h-3.5 text-emerald-500"
                  strokeWidth={2}
                />
                {badge}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
