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
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
  { icon: Linkedin, label: "LinkedIn" },
];

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + Contact */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <GraduationCap className="h-6 w-6" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                School<span className="text-brand-400">Hive</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Connecting ambitious students with the scholarships that shape
              their future.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                <span>info@schoolhive.edu</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-brand-400" />
                <span>123 University Ave, City, State 12345</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-400 transition-colors hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Programs
            </h3>
            <ul className="space-y-2.5 text-sm">
              {programs.map((program) => (
                <li key={program} className="text-slate-400">
                  {program}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Stay Connected
            </h3>
            <p className="text-sm text-slate-400">
              Subscribe for the latest scholarship opportunities.
            </p>
            <form
              className="mt-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex overflow-hidden rounded-xl bg-slate-800 ring-1 ring-slate-700 focus-within:ring-2 focus-within:ring-brand-500">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <div className="mt-6 flex gap-3">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-brand-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} SchoolHive. All rights reserved.</p>
          <p>Empowering education through scholarships.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
