import { CheckCircle2 } from "lucide-react";
import img1 from "../../assist/image/AboutUs/student1.jpg";
import img2 from "../../assist/image/AboutUs/student2.jpg";
import img3 from "../../assist/image/AboutUs/student4.png";
import signature from "../../assist/image/AboutUs/signature.png";

const highlights = [
  "Hands-on leadership experience",
  "Proven teaching methodology",
  "Global scholarship network",
];

export default function AboutUs() {
  return (
    <section className="bg-white">
      <div className="container-page py-20 md:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Text */}
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700">
              About Us
            </span>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl">
              Experience in School Leadership &amp; Teaching
            </h2>
            <p className="leading-relaxed text-slate-500">
              Mauris sit amet lacinia est, vitae tristique metus. Nulla
              facilisi. Mauris tempor nibh vitae pulvinar ultricies. Sed
              malesuada placerat metus. Vivamus sagittis arcu eu elit semper,
              eget varius turpis posuere. Suspendisse ac nibh cursus, dignissim
              urna a, porttitor nisi.
            </p>
            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />
                  <span className="font-medium text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full ring-4 ring-brand-100">
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
                className="hidden object-contain lg:block"
              />
            </div>
          </div>

          {/* Image collage */}
          <div className="relative">
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3">
                <img
                  src={img3}
                  alt="Students studying together"
                  className="h-[380px] w-full rounded-3xl object-cover shadow-lift lg:h-[460px]"
                />
              </div>
              <div className="col-span-2 flex flex-col gap-4">
                <img
                  src={img2}
                  alt="Teacher in library"
                  className="h-[180px] w-full rounded-3xl object-cover lg:h-[220px]"
                />
                <div className="flex h-[180px] flex-col justify-center rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white lg:h-[220px]">
                  <p className="text-4xl font-extrabold">15+</p>
                  <p className="mt-1 text-sm font-medium text-brand-200">
                    Years of academic excellence
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 -z-10 h-40 w-40 rounded-3xl bg-amber-200/60 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
