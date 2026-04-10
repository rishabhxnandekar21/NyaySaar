import { motion } from "framer-motion";
import { Upload, Brain, BookOpen } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload Document",
    description: "Drop your court order PDF into the system",
  },
  {
    icon: Brain,
    number: "02",
    title: "AI Understands",
    description: "Our AI reads and analyzes the legal text",
  },
  {
    icon: BookOpen,
    number: "03",
    title: "Clear Explanation",
    description: "Get a plain-language summary you can understand",
  },
];

export default function SolutionSection() {
  return (
    <section
      id="how-it-works"
      data-testid="solution-section"
      className="py-24 sm:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4 block">
            How It Works
          </span>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Three simple steps
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative flex flex-col md:flex-row items-center justify-center">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px">
            <div className="w-full h-full border-t-2 border-dashed border-zinc-200" />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              data-testid={`solution-step-${i}`}
              className="group relative flex flex-col items-center text-center md:w-1/3 px-6 mb-12 md:mb-0"
            >
              {/* Circle */}
              <div className="relative z-10 w-[120px] h-[120px] bg-white border border-zinc-200 rounded-full flex flex-col items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 mb-8">
                <step.icon
                  className="w-6 h-6 text-zinc-700 mb-1 group-hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                  {step.number}
                </span>
              </div>

              {/* Text */}
              <h3
                className="text-xl font-semibold tracking-tight text-zinc-900 mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {step.title}
              </h3>

              <p className="text-sm text-zinc-500 leading-relaxed max-w-[240px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
