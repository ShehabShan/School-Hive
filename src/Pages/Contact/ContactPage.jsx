import { useState } from "react";
import { Phone, Mail, MapPin, Send, Clock } from "lucide-react";
import toast from "react-hot-toast";

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
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
    },
    {
      icon: Mail,
      label: "Email",
      value: "scholarships@schoolhive.com",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "123 Scholarship Ave, Education City, USA",
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Mon–Fri, 9am – 5pm EST",
    },
  ];

  return (
    <section className="bg-slate-50 py-20 md:py-24">
      <div className="container-page">
        <div className="section-title">
          <span className="eyebrow">Get in touch</span>
          <h2>Contact Us</h2>
          <p>
            We are here to help with any questions about our scholarship
            programs.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft lg:col-span-3"
          >
            <h3 className="text-lg font-bold text-slate-900">
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
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 font-bold text-white shadow-soft transition-colors hover:bg-brand-700 sm:w-auto"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </form>

          {/* Info + Map */}
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
              <h3 className="text-lg font-bold text-slate-900">
                Contact Information
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Our scholarship team is ready to help.
              </p>
              <div className="mt-6 space-y-5">
                {contactInfo.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
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
            </div>

            <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-100 to-indigo-100">
              <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,#6366f1_1px,transparent_1px),linear-gradient(to_bottom,#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lift">
                  <MapPin className="h-7 w-7" />
                </div>
                <p className="mt-3 text-sm font-bold text-brand-800">
                  Find us on the map
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
