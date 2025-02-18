import { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  LibraryIcon as BuildingLibrary,
  Atom,
  GraduationCap,
  ScrollText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import bg1 from "../../assist/bgImg/bg1.jpg";
import bg2 from "../../assist/bgImg/bg2.jpg";
import bg3 from "../../assist/bgImg/bg3.jpg";
import bg5 from "../../assist/bgImg/bg5.jpg";

// Utility for conditional class names
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Section Data
const sections = [
  {
    id: 1,
    title: "Undergraduate Studies",
    icon: <BuildingLibrary className="h-8 w-8" />,
    bgImage: bg1,
    bgColor: "bg-slate-800",
  },
  {
    id: 2,
    title: "Lifelong Learning",
    icon: <Atom className="h-8 w-8" />,
    bgImage: bg2,
    bgColor: "bg-blue-800",
  },
  {
    id: 3,
    title: "Feldman Lab",
    icon: <GraduationCap className="h-8 w-8" />,
    bgImage: bg3,
    bgColor: "bg-slate-700",
  },
  {
    id: 4,
    title: "Graduate Studies",
    icon: <ScrollText className="h-8 w-8" />,
    bgImage: bg5,
    bgColor: "bg-red-800",
  },
];

export default function HeroCarousel() {
  const [currentSection, setCurrentSection] = useState(0);

  // Animations for the text and buttons
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative h-screen w-full">
      {/* Background image container */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        <img
          src={sections[currentSection].bgImage}
          alt="Background"
          className="w-full h-[850px] "
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Static overlay content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection} // Force re-render on section change
          className="absolute inset-0 flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            y: -20,
            transition: { duration: 0.5, ease: "easeIn" },
          }}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-2xl space-y-6">
              {/* Title and Description: Animating only for ID 1 and 3 */}
              <motion.h1
                className="whitespace-pre-line text-5xl font-bold text-white md:text-6xl"
                variants={
                  currentSection === 1 || currentSection === 3
                    ? textVariants
                    : { hidden: {}, visible: {} }
                }
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {"Welcome To\nEduan University"}
              </motion.h1>
              <motion.p
                className="text-lg text-white/90"
                variants={
                  currentSection === 1 || currentSection === 3
                    ? textVariants
                    : { hidden: {}, visible: {} }
                }
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                Cosmic is committed to providing learning opportunities tailored
                to support emerging career opportunities.
              </motion.p>

              {/* Buttons: Animating only for ID 2 and 4 */}
              <motion.div
                className="flex gap-4"
                variants={
                  currentSection === 2 || currentSection === 4
                    ? buttonVariants
                    : { hidden: {}, visible: {} }
                }
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Apply Now
                  <ChevronRight className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded bg-amber-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-600"
                >
                  Learn More
                  <ChevronRight className="h-4 w-4" />
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 grid grid-cols-4">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => setCurrentSection(index)}
            className={cn(
              "group flex items-center lg:gap-4 py-5 lg:p-6 text-white transition-colors hover:bg-opacity-90",
              section.bgColor,
              currentSection === index ? "bg-opacity-100" : "bg-opacity-80"
            )}
          >
            {section.icon}
            <div className="flex items-center lg:gap-2">
              <span className="font-semibold text-sm">{section.title}</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
