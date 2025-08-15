import { useEffect, useRef, useState } from "react";

const CircleStat = ({ label, value, subline }: { label: string; value: number; subline: string }) => {
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          const duration = 1400;
          const start = performance.now();
          const animate = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            setProgress(p);
            setCount(Math.floor(value * p));
            if (p < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  const offset = circumference * (1 - progress);
  const strokeColor = `hsl(0 70% ${50 - (progress * 14)}%)`;

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative">
        <svg width="144" height="144" className="mb-4">
          <circle cx="72" cy="72" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.1s ease, stroke 0.1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-brand text-2xl md:text-3xl text-center">
            {count.toLocaleString()}{value >= 1000 ? "+" : ""}
          </div>
        </div>
      </div>
      <div className="text-sm font-semibold text-foreground text-center">{label}</div>
      <div className="text-xs text-muted-foreground mt-1 text-center">{subline}</div>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto">
      <header className="mb-8 text-center">
        <h2 className="font-brand text-3xl md:text-4xl">Project Statistics</h2>
        <p className="text-muted-foreground mt-2">Reflecting NESPAK’s track record and sectoral breadth.</p>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <CircleStat 
          label="Ongoing Projects" 
          value={570} 
          subline="540 Local and 30 Overseas Projects" 
        />
        <CircleStat 
          label="Completed Projects" 
          value={4151} 
          subline="3,596 Local and 555 Overseas Projects" 
        />
        <CircleStat 
          label="Total Projects" 
          value={4721} 
          subline="Total Ongoing and Completed Projects" 
        />
        <CircleStat 
          label="Employees" 
          value={10000} 
          subline="Skilled professionals across all sectors" 
        />
      </div>
      </div>
    </section>
  );
};

export default StatsSection;
