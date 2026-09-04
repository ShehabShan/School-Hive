import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import HeroCarousel from "../Component/HeroCoursor/HeroCarousel";
import RouteFallback from "../Component/ui/RouteFallback";

const AboutUs = lazy(() => import("../Component/AboutUs/AboutUs"));
const TopScholarship = lazy(() => import("../Pages/TopScholarship/TopScholarship"));
const DeadlineStrip = lazy(() => import("../Component/scholarship/DeadlineStrip"));
const ScholarshipHighlights = lazy(() => import("../Component/ExtraFeature/ScholarshipHighlights"));
const ScholershipStatic = lazy(() => import("../Component/ExtraFeature/ScholershipStatic"));
const ContactPage = lazy(() => import("../Pages/Contact/ContactPage"));

const SectionSuspense = ({ children }) => (
  <Suspense fallback={<RouteFallback />}>{children}</Suspense>
);

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col overflow-x-clip"
    >
      <HeroCarousel />
      <SectionSuspense><DeadlineStrip /></SectionSuspense>
      <SectionSuspense><AboutUs /></SectionSuspense>
      <SectionSuspense><TopScholarship /></SectionSuspense>
      <SectionSuspense><ScholarshipHighlights /></SectionSuspense>
      <SectionSuspense><ScholershipStatic /></SectionSuspense>
      <SectionSuspense><ContactPage /></SectionSuspense>
    </motion.div>
  );
};

export default Home;
