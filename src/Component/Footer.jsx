import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <FaPhoneAlt className="h-5 w-5 mr-2" />
                <span>(123) 456-7890</span>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="h-5 w-5 mr-2" />
                <span>info@scholarships.edu</span>
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="h-5 w-5 mr-2" />
                <span>123 University Ave, City, State 12345</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Scholarships</li>
              <li>Application Process</li>
              <li>FAQs</li>
              <li>Student Resources</li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Programs</h3>
            <ul className="space-y-2">
              <li>Undergraduate Scholarships</li>
              <li>Graduate Fellowships</li>
              <li>International Students</li>
              <li>Research Grants</li>
              <li>Athletic Scholarships</li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <div className="flex space-x-4">
              <FaFacebookF className="h-6 w-6" />
              <FaTwitter className="h-6 w-6" />
              <FaInstagram className="h-6 w-6" />
              <FaLinkedinIn className="h-6 w-6" />
            </div>
            <div className="mt-4">
              <p className="text-sm">Subscribe to our newsletter for updates</p>
              <div className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>&copy; 2025 Scholarship Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
