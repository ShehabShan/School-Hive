import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion } from "framer-motion";

const slides = [
  { image: "https://picsum.photos/seed/campus1/1200/600", title: "Campus Highlights" },
  { image: "https://picsum.photos/seed/campus2/1200/600", title: "Study Abroad" },
  { image: "https://picsum.photos/seed/campus3/1200/600", title: "Scholarship Fairs" },
  { image: "https://picsum.photos/seed/campus4/1200/600", title: "Alumni Success" },
  { image: "https://picsum.photos/seed/campus5/1200/600", title: "Research Labs" },
  { image: "https://picsum.photos/seed/campus6/1200/600", title: "Campus Life" },
];

const Banner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="container-page py-10"
    >
      <div className="overflow-hidden rounded-3xl shadow-lift ring-1 ring-slate-200">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          showArrows={false}
          interval={4500}
          swipeable
          emulateTouch
          className="banner-carousel"
        >
          {slides.map(({ image, title }) => (
            <div key={title} className="relative">
              <img
                src={image}
                alt={title}
                className="h-72 w-full object-cover sm:h-96 lg:h-[460px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-6 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white ring-1 ring-white/25 backdrop-blur">
                {title}
              </span>
            </div>
          ))}
        </Carousel>
      </div>
    </motion.div>
  );
};

export default Banner;
