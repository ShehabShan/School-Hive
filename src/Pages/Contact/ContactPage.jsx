import { useState } from "react";

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formState);
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="max-w-[1440px] w-full bg-white p-8 shadow-lg rounded-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
            <p className="mt-2 text-gray-500">
              We're here to help with any questions about our scholarship
              programs.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white p-6 shadow-md rounded-md"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border rounded-md p-2"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Send Message
                </button>
              </div>
            </form>

            {/* Contact Info & Map */}
            <div>
              {/* Contact Info */}
              <div className="bg-white shadow-md rounded-md p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Contact Information
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Get in touch with our scholarship team.
                </p>
                <div className="mt-4 space-y-4">
                  <div className="text-gray-700">
                    <strong>📞 Phone:</strong> +1 (555) 123-4567
                  </div>
                  <div className="text-gray-700">
                    <strong>📧 Email:</strong> scholarships@example.com
                  </div>
                  <div className="text-gray-700">
                    <strong>📍 Address:</strong> 123 Scholarship Ave, Education
                    City, ST 12345, USA
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-6 bg-gray-300 h-64 rounded-md flex items-center justify-center">
                <p className="text-gray-600">Map Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
