import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  GraduationCap,
  Send,
  ArrowRight,
  Heart,
} from "lucide-react";

const quickLinks = [
  { label: "About Us", to: "/aboutUs" },
  { label: "All Scholarships", to: "/allScholership" },
  { label: "Contact", to: "/contact" },
  { label: "Sign In", to: "/signIn" },
  { label: "Register", to: "/registration" },
];

const programs = [
  "Undergraduate Scholarships",
  "Graduate Fellowships",
  "International Students",
  "Research Grants",
  "Athletic Scholarships",
];

const socials = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-brand-600/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"
      />

      <div className="container-page relative py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand + Contact */}
          <div className="lg:col-span-4">
            <Link to="/" className="group flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105">
                <GraduationCap className="h-6 w-6" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                School<span className="text-brand-400">Hive</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Connecting ambitious students with the scholarships that shape
              their future — one opportunity at a time.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Phone className="h-3.5 w-3.5 text-brand-400" />
                </span>
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Mail className="h-3.5 w-3.5 text-brand-400" />
                </span>
                <span>info@schoolhive.edu</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <MapPin className="h-3.5 w-3.5 text-brand-400" />
                </span>
                <span>123 University Ave, City, State 12345</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-brand-400"
                  >
                    <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                    <span className="-translate-x-1.5 transition-transform duration-200 group-hover:translate-x-0">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Programs
            </h3>
            <ul className="space-y-2.5 text-sm">
              {programs.map((program) => (
                <li key={program} className="flex items-center gap-2 text-slate-400">
                  <span className="h-1 w-1 rounded-full bg-brand-500" />
                  {program}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Stay Connected
            </h3>
            <p className="text-sm text-slate-400">
              Subscribe for the latest scholarship opportunities delivered
              straight to your inbox.
            </p>
            <form
              className="mt-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex overflow-hidden rounded-xl bg-white/5 p-1.5 ring-1 ring-white/10 transition-shadow focus-within:ring-2 focus-within:ring-brand-500">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="w-full bg-transparent px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:from-brand-600 hover:to-brand-800 hover:shadow-soft"
                >
                  <Send className="h-3.5 w-3.5" />
                  Subscribe
                </button>
              </div>
            </form>
            <div className="mt-6 flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-brand-500 hover:to-brand-700 hover:text-white hover:ring-transparent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 text-sm text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} SchoolHive. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Empowering education through scholarships
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
