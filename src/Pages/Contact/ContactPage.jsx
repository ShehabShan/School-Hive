import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Clock,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import "./ContactPage.css";

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We will get back to you soon.");
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15";

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      accent: "bg-brand-50 text-brand-600 ring-brand-100",
    },
    {
      icon: Mail,
      label: "Email",
      value: "scholarships@schoolhive.com",
      accent: "bg-sky-50 text-sky-600 ring-sky-100",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "123 Scholarship Ave, Education City, USA",
      accent: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Mon–Fri, 9am – 5pm EST",
      accent: "bg-amber-50 text-amber-600 ring-amber-100",
    },
  ];

  return (
    <section className="contact-wrapper relative overflow-hidden bg-slate-50 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl"
      />
      <div className="container-page relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          <span className="eyebrow">
            <MessageCircle className="h-3.5 w-3.5" />
            Get in touch
          </span>
          <h2>Contact Us</h2>
          <p>
            We are here to help with any questions about our scholarship
            programs.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft lg:col-span-3"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Send className="h-4 w-4" />
              </span>
              Send us a message
            </h3>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-sm font-semibold text-slate-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="contact-name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="text-sm font-semibold text-slate-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="contact-email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-subject"
                  className="text-sm font-semibold text-slate-700"
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="contact-subject"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="How can we help?"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-message"
                  className="text-sm font-semibold text-slate-700"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="contact-message"
                  rows="5"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Write your message..."
                />
              </div>
            </div>
            <button
              type="submit"
              className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3.5 font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:w-auto"
            >
              <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              Send Message
            </button>
          </motion.form>

          {/* Info + Map */}
          <div className="space-y-8 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft"
            >
              <h3 className="text-lg font-bold text-slate-900">
                Contact Information
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Our scholarship team is ready to help.
              </p>
              <div className="mt-6 space-y-5">
                {contactInfo.map(({ icon: Icon, label, value, accent }) => (
                  <div key={label} className="group flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-110 ${accent}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-700">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative flex h-56 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 shadow-lift"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
              />
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-2xl" />
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
                  <MapPin className="h-7 w-7" />
                </div>
                <p className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-white">
                  Find us on the map
                  <ChevronRight className="h-4 w-4" />
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
