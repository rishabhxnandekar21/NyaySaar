import { motion } from "framer-motion";
import { FileText, Users, Eye } from "lucide-react";

const problems = [
  {
    icon: FileText,
    title: "Complex Legal Language",
    description:
      "Court orders are written in dense legal jargon that requires years of training to fully comprehend.",
  },
  {
    icon: Users,
    title: "Citizens Struggle",
    description:
      "Millions of people receive court orders they cannot understand, leading to confusion and missed deadlines.",
  },
  {
    icon: Eye,
    title: "Access is Not Understanding",
    description:
      "Having a document in hand doesn't mean you understand it. True access means true comprehension.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // smoother cubic-bezier
    },
  },
};

export default function ProblemSection() {
  return (
    <section
      data-testid="problem-section"
      className="py-24 sm:py-32 bg-gradient-to-b from-white to-zinc-50"
      aria-label="Problem section explaining legal accessibility issues"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4 block">
            The Problem
          </span>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Why this matters
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
        >
          {problems.map((problem, i) => {
            const Icon = problem.icon;

            return (
              <motion.div
                key={i}
                variants={cardVariants}
                data-testid={`problem-card-${i}`}
                whileHover={{ y: -6 }}
                className="group relative bg-white border border-zinc-200/60 rounded-2xl sm:rounded-[2rem] p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-medium tracking-tight text-zinc-900 mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {problem.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {problem.description}
                </p>

                {/* subtle hover glow */}
                <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none bg-gradient-to-br from-transparent via-transparent to-zinc-100/40" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
