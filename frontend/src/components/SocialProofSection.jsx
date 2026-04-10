import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const metrics = [
  { value: 10000, suffix: "+", label: "Documents Simplified", display: "10K+" },
  { value: 98, suffix: "%", label: "Accuracy Rate", display: "98%" },
  { value: 50, suffix: "+", label: "NGOs & Researchers", display: "50+" },
];

function AnimatedCounter({ target, suffix, display }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 2000;
          const start = performance.now();

          const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);

            // easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));

            if (progress < 1) {
              frameRef.current = requestAnimationFrame(tick);
            }
          };

          frameRef.current = requestAnimationFrame(tick);

          // Stop observing after triggering once
          observer.unobserve(node);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, hasAnimated]);

  const formatCount = (n) => {
    if (target >= 1000) {
      return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
    }
    return n.toString();
  };

  return (
    <span ref={ref}>
      {hasAnimated ? `${formatCount(count)}${suffix}` : display}
    </span>
  );
}

export default function SocialProofSection() {
  return (
    <section
      data-testid="social-proof-section"
      className="py-24 sm:py-32 bg-zinc-50/50"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4 block">
            Trusted By Many
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Making an impact
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              data-testid={`metric-${i}`}
              className="text-center"
            >
              <p
                className="text-5xl sm:text-6xl font-light tracking-tighter text-zinc-900 mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <AnimatedCounter
                  target={metric.value}
                  suffix={metric.suffix}
                  display={metric.display}
                />
              </p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-16 text-sm text-zinc-400"
        >
          Used by citizens, NGOs, legal researchers, and organizations across
          India
        </motion.p>
      </div>
    </section>
  );
}
