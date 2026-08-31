import { motion } from "framer-motion";
import AboutUs from "../Component/AboutUs/AboutUs";
import ScholarshipHighlights from "../Component/ExtraFeature/ScholarshipHighlights";
import ScholershipStatic from "../Component/ExtraFeature/ScholershipStatic";
import HeroCarousel from "../Component/HeroCoursor/HeroCarousel";
import ContactPage from "../Pages/Contact/ContactPage";
import TopScholarship from "../Pages/TopScholarship/TopScholarship";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col overflow-x-clip"
    >
      {/* <Banner></Banner> */}
      <HeroCarousel />
      <AboutUs />
      <TopScholarship />
      <ScholarshipHighlights />
      <ScholershipStatic />
      <ContactPage />
    </motion.div>
  );
};

export default Home;
