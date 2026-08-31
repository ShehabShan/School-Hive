import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Library, Atom, GraduationCap, ScrollText, ArrowRight } from "lucide-react";
import bg1 from "../../assist/bgImg/bg1.jpg";
import bg2 from "../../assist/bgImg/bg2.jpg";
import bg3 from "../../assist/bgImg/bg3.jpg";
import bg5 from "../../assist/bgImg/bg5.jpg";
import { cn } from "../../lib/cn";

const sections = [
  {
    id: 1,
    title: "Undergraduate Studies",
    icon: Library,
    bgImage: bg1,
    accent: "hover:bg-brand-700",
    active: "bg-brand-700",
    inactive: "bg-slate-900/60",
  },
  {
    id: 2,
    title: "Lifelong Learning",
    icon: Atom,
    bgImage: bg2,
    accent: "hover:bg-indigo-700",
    active: "bg-indigo-700",
    inactive: "bg-slate-900/60",
  },
  {
    id: 3,
    title: "Feldman Lab",
    icon: GraduationCap,
    bgImage: bg3,
    accent: "hover:bg-violet-700",
    active: "bg-violet-700",
    inactive: "bg-slate-900/60",
  },
  {
    id: 4,
    title: "Graduate Studies",
    icon: ScrollText,
    bgImage: bg5,
    accent: "hover:bg-amber-600",
    active: "bg-amber-600",
    inactive: "bg-slate-900/60",
  },
];

export default function HeroCarousel() {
  const [currentSection, setCurrentSection] = useState(0);

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-slate-900">
      {/* Background */}
      <AnimatePresence>
        <motion.img
          key={currentSection}
          src={sections[currentSection].bgImage}
          alt="University campus"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-900/30" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/80 to-transparent" />

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
              className="max-w-2xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-white/20 backdrop-blur">
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
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-amber-500/25 transition-colors hover:bg-amber-600"
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/aboutUs"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-7 py-3.5 font-bold text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/20"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Section tabs */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = currentSection === index;
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                aria-pressed={isActive}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-4 text-white transition-colors sm:py-5",
                  isActive ? section.active : cn(section.inactive, "hover:bg-white/10")
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
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
