import AboutUs from "../Component/AboutUs/AboutUs";
import Banner from "../Component/Banner";
import ScholarshipHighlights from "../Component/ExtraFeature/ScholarshipHighlights";
import ScholershipStatic from "../Component/ExtraFeature/ScholershipStatic";
import Footer from "../Component/Footer";
import HeroCarousel from "../Component/HeroCoursor/HeroCarousel";
import ContactPage from "../Pages/Contact/ContactPage";
import TopScholarship from "../Pages/TopScholarship/TopScholarship";

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* <Banner></Banner> */}
      <HeroCarousel></HeroCarousel>
      <AboutUs></AboutUs>

      <TopScholarship></TopScholarship>
      <ScholarshipHighlights></ScholarshipHighlights>
      <ScholershipStatic></ScholershipStatic>
      <ContactPage></ContactPage>
      <Footer></Footer>
    </div>
  );
};

export default Home;
