import { motion } from "framer-motion";

export function SectionHeader({
  code,
  title,
  subtitle,
  align = "left",
}: {
  code: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={centered ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}
    >
      <div
        className={`flex items-center gap-3 mb-4 ${centered ? "justify-center" : ""}`}
      >
        <span className="font-mono text-xs tracking-[0.4em] text-primary">[{code}]</span>
        <span className="h-px w-12 bg-primary/40" />
      </div>
      <h2 className="font-display font-extrabold uppercase tracking-tight text-4xl md:text-6xl leading-[0.95]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-muted-foreground text-base md:text-lg leading-relaxed font-light">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
