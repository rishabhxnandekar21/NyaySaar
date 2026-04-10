import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection({ onUploadClick }) {
  return (
    <section
      data-testid="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-[120px] animate-float-slow-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-100/20 rounded-full blur-[100px] animate-float-slow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-zinc-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2} />
          <span
            data-testid="hero-badge"
            className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-600"
          >
            AI-Powered Legal Clarity
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          data-testid="hero-headline"
          className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter leading-tight text-zinc-900 mb-6"
          style={{ fontFamily: "var(--font-heading, sans-serif)" }}
        >
          Making Court Orders
          <br />
          <span className="text-zinc-400">Understandable</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          data-testid="hero-subheadline"
          className="text-base sm:text-lg text-zinc-500 leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ fontFamily: "var(--font-body, sans-serif)" }}
        >
          Transform complex legal documents into clear, simple explanations
          using AI no legal expertise required.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            data-testid="hero-upload-cta"
            onClick={() => onUploadClick?.()} // ✅ safe fix
            className="group bg-zinc-900 text-white rounded-full px-8 py-4 font-medium text-sm hover:bg-zinc-700 transition-all duration-300 shadow-lg shadow-black/10 flex items-center gap-2.5 active:scale-[0.98]"
          >
            Upload Court Order
            <ArrowRight
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
              strokeWidth={2}
            />
          </button>

          <a
            href="#how-it-works"
            data-testid="hero-learn-more"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors px-6 py-4"
          >
            See how it works
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-8 border-2 border-zinc-300 rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 h-2 bg-zinc-400 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
