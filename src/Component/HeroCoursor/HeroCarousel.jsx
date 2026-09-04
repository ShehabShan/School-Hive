import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Library,
  Atom,
  GraduationCap,
  ScrollText,
  ArrowRight,
  Sparkles,
  Users,
  Trophy,
  Globe2,
} from "lucide-react";
import bg1Jpg from "../../assist/bgImg/bg1.jpg";
import bg2Jpg from "../../assist/bgImg/bg2.jpg";
import bg3Jpg from "../../assist/bgImg/bg3.jpg";
import bg5Jpg from "../../assist/bgImg/bg5.jpg";
import bg1Webp from "../../assist/bgImg/bg1.webp";
import bg2Webp from "../../assist/bgImg/bg2.webp";
import bg3Webp from "../../assist/bgImg/bg3.webp";
import bg5Webp from "../../assist/bgImg/bg5.webp";
import { cn } from "../../lib/cn";

const sections = [
  {
    id: 1,
    title: "Undergraduate Studies",
    icon: Library,
    bgImage: bg1Webp,
    bgFallback: bg1Jpg,
    accent: "hover:bg-brand-600",
    active: "bg-brand-600",
    inactive: "bg-slate-950/50",
    chip: "text-amber-300",
  },
  {
    id: 2,
    title: "Lifelong Learning",
    icon: Atom,
    bgImage: bg2Webp,
    bgFallback: bg2Jpg,
    accent: "hover:bg-indigo-600",
    active: "bg-indigo-600",
    inactive: "bg-slate-950/50",
    chip: "text-sky-300",
  },
  {
    id: 3,
    title: "Feldman Lab",
    icon: GraduationCap,
    bgImage: bg3Webp,
    bgFallback: bg3Jpg,
    accent: "hover:bg-violet-600",
    active: "bg-violet-600",
    inactive: "bg-slate-950/50",
    chip: "text-violet-300",
  },
  {
    id: 4,
    title: "Graduate Studies",
    icon: ScrollText,
    bgImage: bg5Webp,
    bgFallback: bg5Jpg,
    accent: "hover:bg-amber-500",
    active: "bg-amber-500",
    inactive: "bg-slate-950/50",
    chip: "text-amber-300",
  },
];

const stats = [
  { icon: Users, value: "12k+", label: "Students placed" },
  { icon: Trophy, value: "850+", label: "Scholarships" },
  { icon: Globe2, value: "40+", label: "Partner universities" },
];

export default function HeroCarousel() {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const tick = () => {
      if (document.hidden) return;
      setCurrentSection((prev) => (prev + 1) % sections.length);
    };
    const timer = setInterval(tick, 7000);
    const onVis = () => {};
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden bg-slate-950">
      {/* Background */}
      <AnimatePresence>
        <motion.picture
          key={currentSection}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "transform, opacity" }}
        >
          <source srcSet={sections[currentSection].bgImage} type="image/webp" />
          <img
            src={sections[currentSection].bgFallback}
            alt="University campus"
            className="h-full w-full object-cover"
            loading={currentSection === 0 ? "eager" : "lazy"}
            fetchPriority={currentSection === 0 ? "high" : "low"}
            decoding="async"
          />
        </motion.picture>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-900/20" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container-page">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl pb-40 sm:pb-32"
            >
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/20 backdrop-blur",
                  sections[currentSection].chip
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {sections[currentSection].title}
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                  Eduan University
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 md:text-lg">
                SchoolHive connects you with the scholarships that make your
                education possible. Explore programs, apply in minutes, and
                track your applications — all in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/allScholership"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-amber-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/40"
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/aboutUs"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-7 py-3.5 font-bold text-white ring-1 ring-white/25 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats strip */}
              <div className="mt-12 flex flex-wrap gap-8 border-t border-white/15 pt-6">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                      <Icon className="h-5 w-5 text-amber-300" />
                    </span>
                    <div>
                      <p className="text-lg font-extrabold leading-none text-white">
                        {value}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Section tabs */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="grid grid-cols-2 border-t border-white/10 bg-slate-950/40 backdrop-blur-md sm:grid-cols-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = currentSection === index;
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                aria-pressed={isActive}
                className={cn(
                  "group relative flex items-center justify-center gap-2 px-3 py-4 text-white transition-colors sm:py-5",
                  isActive ? section.active : cn(section.inactive, "hover:bg-white/10")
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="hero-tab-indicator"
                    className="absolute inset-x-0 top-0 h-0.5 bg-white/80"
                  />
                )}
                <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span className="hidden text-sm font-semibold md:block">
                  {section.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
