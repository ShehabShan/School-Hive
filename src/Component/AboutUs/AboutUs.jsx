import { motion } from "framer-motion";
import { Award, ShieldCheck, Sparkles, Building2, MessageSquare, Users, BookOpen, CheckCircle2, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import img1 from "../../assist/image/AboutUs/student1.webp";
import img2 from "../../assist/image/AboutUs/student2.webp";
import img3 from "../../assist/image/AboutUs/student4.webp";
import signature from "../../assist/image/AboutUs/signature.png";

const highlights = [
  {
    text: "Verified institutions — approved before publishing",
    icon: Building2,
  },
  {
    text: "Peer Q&A forum — 7 categories, 60+ tags, threaded replies",
    icon: MessageSquare,
  },
  {
    text: "Trust & reputation — Verified badge, +15 accepted, daily cap 50",
    icon: ShieldCheck,
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
    <>
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
              Empowering Students Through{" "}
              <span className="text-gradient">Scholarships & Community</span>
            </h2>
            <p className="leading-relaxed text-slate-500">
              School-Hive connects students with verified scholarships from
              approved institutions and a peer Q&A community — discover
              opportunities, get guidance from those who’ve been there, and
              track applications, saves and reputation in one dashboard.
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
                    alt="Trusted community"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Trusted by students & institutions</h3>
                  <p className="text-sm text-slate-500">Verified publishers · peer-guided choices</p>
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
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="col-span-2 flex flex-col gap-4">
                <div className="overflow-hidden rounded-3xl">
                  <img
                    src={img2}
                    alt="Teacher in library"
                    className="h-[180px] w-full object-cover transition-transform duration-500 hover:scale-105 lg:h-[220px]"
                    loading="lazy"
                    decoding="async"
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
                  <p className="text-4xl font-extrabold">500+</p>
                  <p className="mt-1 text-sm font-medium text-brand-200">
                    Scholarships & growing Q&A community
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

      {/* Institution System — below hero */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="container-page py-16 md:py-20">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 ring-1 ring-violet-100">
              <Building2 className="h-3.5 w-3.5" /> For Institutions
            </span>
            <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Trusted by institutions, <span className="text-gradient">built for discovery</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Institutions register, get verified by a <span className="font-semibold text-slate-700">superadmin</span> (`pending → approved`), then publish and manage their own scholarships — with full ownership (`createdBy`) and audience insights.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Verified onboarding",
                desc: "Every institution is reviewed before publishing. Rejected or pending accounts cannot post — spam stays out.",
                accent: "bg-emerald-50 text-emerald-600 ring-emerald-100",
              },
              {
                icon: BookOpen,
                title: "Own your listings",
                desc: "Publish with gallery, video, brochure and map. Edit only your scholarships — superadmin + owner guards enforce it.",
                accent: "bg-violet-50 text-violet-600 ring-violet-100",
              },
              {
                icon: Users,
                title: "Reach the right students",
                desc: "Applications carry statusHistory, saved counts and follows — see applicants and track interest in your dashboard.",
                accent: "bg-sky-50 text-sky-600 ring-sky-100",
              },
            ].map(({ icon: Icon, title, desc, accent }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${accent}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <h4 className="mt-4 text-sm font-bold text-slate-900">{title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/allScholership" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-black">
              <GraduationCap className="h-4 w-4" /> View scholarships
            </Link>
            <Link to="/registration" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
              <Building2 className="h-4 w-4" /> Register as Institution
            </Link>
          </div>
        </div>
      </section>

      {/* Q&A System — below Institutions */}
      <section className="bg-white">
        <div className="container-page py-16 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative order-2 lg:order-1"
            >
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3 space-y-4">
                  <div className="rounded-3xl bg-white p-4 shadow-lift ring-1 ring-slate-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                        <MessageSquare className="h-3.5 w-3.5" />
                      </span>
                      Q&A preview
                    </div>
                    <p className="mt-3 text-sm font-bold leading-snug text-slate-900">How to get a fully funded scholarship for Masters in Canada?</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-100">Accepted</span>
                      <span className="text-xs text-slate-400">· 12 answers · 342 views</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                      <Award className="h-3.5 w-3.5 text-amber-500" /> +15 accepted · <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Verified author
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Threaded replies</p>
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">Great answer — add source link for +3 bonus</div>
                      <div className="ml-4 rounded-xl bg-white p-3 ring-1 ring-slate-100">Replying to @peer — depth capped at 3, visually flattened</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex flex-col gap-4">
                  <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-lift">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-200">Categories</p>
                    <p className="mt-2 text-lg font-extrabold leading-tight">7 categories · 60+ tags</p>
                    <p className="mt-1 text-xs text-brand-100">Study Abroad · Funding · Visa · Research</p>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Reputation</p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">+2 / +10 / +15</p>
                    <p className="text-xs text-slate-500">question upvote · answer upvote · accepted · cap 50/day</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 -top-4 -z-10 h-32 w-32 rounded-3xl bg-brand-100/70 blur-2xl" />
            </motion.div>

            <motion.div {...fadeUp} className="order-1 space-y-6 lg:order-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
                <MessageSquare className="h-3.5 w-3.5" /> Community Q&A
              </span>
              <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-3xl">
                Ask, answer, <span className="text-gradient">grow together</span>
              </h3>
              <p className="leading-relaxed text-slate-500">
                Beyond listings — get guidance from peers who’ve been there. Questions support markdown, source links and duplicate detection; answers are voted, accepted and discussed in threads.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: MessageSquare, t: "Ask with context", d: "7 categories, 60+ tags, destination & study-level context + duplicate panel." },
                  { icon: Award, t: "Quality rewarded", d: "Verified badge via credential review, reputation and completeness drive visibility." },
                  { icon: Users, t: "Conversations that help", d: "Nested replies to depth 3, upvote to reward asker — capped and flattened for readability." },
                ].map(({ icon: Icon, t, d }) => (
                  <li key={t} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-slate-900">{t}</span>
                      <span className="text-sm text-slate-500">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/questions" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
                  <MessageSquare className="h-4 w-4" /> Browse Questions
                </Link>
                <Link to="/questions/ask" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
                  <Sparkles className="h-4 w-4" /> Ask a Question
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      </>
  );
}
