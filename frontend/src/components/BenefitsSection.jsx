import { motion } from "framer-motion";
import { Zap, ShieldOff, Languages, Clock } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Instant Understanding",
    description:
      "Get clear explanations of any court order within seconds, not hours.",
    accent: "bg-blue-50",
  },
  {
    icon: ShieldOff,
    title: "No Legal Dependency",
    description:
      "Understand your documents without hiring expensive legal professionals.",
    accent: "bg-purple-50",
  },
  {
    icon: Languages,
    title: "Multilingual Support",
    description:
      "Summaries available in English and Hindi for wider accessibility.",
    accent: "bg-indigo-50",
  },
  {
    icon: Clock,
    title: "Faster Insights",
    description:
      "Save hours of research with AI that extracts key information instantly.",
    accent: "bg-violet-50",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function BenefitsSection() {
  return (
    <section
      data-testid="benefits-section"
      className="py-24 sm:py-32 bg-zinc-50/50"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4 block">
            Benefits
          </span>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Why choose Nyay Saar
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={i}
                variants={cardVariants}
                data-testid={`benefit-card-${i}`}
                className="group bg-white border border-zinc-200/60 rounded-2xl p-8
                           shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                           hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]
                           transition-all duration-300 ease-out cursor-default"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl ${benefit.accent} flex items-center justify-center mb-6
                              group-hover:scale-110 transition-transform duration-300`}
                  aria-hidden="true"
                >
                  <Icon className="w-5 h-5 text-zinc-700" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3
                  className="text-lg font-medium tracking-tight text-zinc-900 mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
