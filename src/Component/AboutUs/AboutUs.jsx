import { motion } from "framer-motion";
import { Award, ShieldCheck, Sparkles } from "lucide-react";
import img1 from "../../assist/image/AboutUs/student1.jpg";
import img2 from "../../assist/image/AboutUs/student2.jpg";
import img3 from "../../assist/image/AboutUs/student4.png";
import signature from "../../assist/image/AboutUs/signature.png";

const highlights = [
  {
    text: "Hands-on leadership experience",
    icon: Award,
  },
  {
    text: "Proven teaching methodology",
    icon: ShieldCheck,
  },
  {
    text: "Global scholarship network",
    icon: Sparkles,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

export default function AboutUs() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-brand-50 blur-3xl"
      />
      <div className="container-page relative py-20 md:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Text */}
          <motion.div {...fadeUp} className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-200">
              About Us
            </span>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl">
              Experience in School{" "}
              <span className="text-gradient">Leadership &amp; Teaching</span>
            </h2>
            <p className="leading-relaxed text-slate-500">
              Mauris sit amet lacinia est, vitae tristique metus. Nulla
              facilisi. Mauris tempor nibh vitae pulvinar ultricies. Sed
              malesuada placerat metus. Vivamus sagittis arcu eu elit semper,
              eget varius turpis posuere. Suspendisse ac nibh cursus, dignissim
              urna a, porttitor nisi.
            </p>
            <ul className="space-y-3">
              {highlights.map(({ text, icon: Icon }) => (
                <li key={text} className="group flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="font-medium text-slate-700">{text}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-6 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full ring-4 ring-brand-100 ring-offset-2">
                  <img
                    src={img1}
                    alt="Vice Principal"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Hugh Millie-Yate</h3>
                  <p className="text-sm text-slate-500">Vice Principal</p>
                </div>
              </div>
              <img
                src={signature}
                alt="Signature"
                width={180}
                height={40}
                className="hidden object-contain opacity-80 lg:block"
              />
            </div>
          </motion.div>

          {/* Image collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 overflow-hidden rounded-3xl shadow-lift">
                <img
                  src={img3}
                  alt="Students studying together"
                  className="h-[380px] w-full object-cover transition-transform duration-500 hover:scale-105 lg:h-[460px]"
                />
              </div>
              <div className="col-span-2 flex flex-col gap-4">
                <div className="overflow-hidden rounded-3xl">
                  <img
                    src={img2}
                    alt="Teacher in library"
                    className="h-[180px] w-full object-cover transition-transform duration-500 hover:scale-105 lg:h-[220px]"
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative flex h-[180px] flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 text-white shadow-lift lg:h-[220px]"
                >
                  <div
                    aria-hidden
                    className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl"
                  />
                  <p className="text-4xl font-extrabold">15+</p>
                  <p className="mt-1 text-sm font-medium text-brand-200">
                    Years of academic excellence
                  </p>
                </motion.div>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 -z-10 h-40 w-40 rounded-3xl bg-amber-200/70 blur-2xl" />
            <div className="absolute -bottom-5 -left-5 -z-10 h-32 w-32 rounded-full border-8 border-brand-100" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
