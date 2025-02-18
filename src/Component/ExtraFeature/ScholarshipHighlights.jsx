import {
  FaGraduationCap,
  FaDollarSign,
  FaUserGraduate,
  FaCheckCircle,
} from "react-icons/fa";

const highlights = [
  {
    title: "1000+",
    description: "Active Scholarships",
    icon: <FaGraduationCap className="text-white text-4xl" />,
  },
  {
    title: "$5M+",
    description: "Awarded Annually",
    icon: <FaDollarSign className="text-white text-4xl" />,
  },
  {
    title: "50k+",
    description: "Student Beneficiaries",
    icon: <FaUserGraduate className="text-white text-4xl" />,
  },
  {
    title: "95%",
    description: "Success Rate",
    icon: <FaCheckCircle className="text-white text-4xl" />,
  },
];

const ScholarshipHighlights = () => (
  <div className="z-40 bg-[#f3f4f6]">
    <section className=" max-w-[1440px] mx-auto mt-16 py-12 bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white text-center mb-12">
          Empowering Education Through Scholarships
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 rounded-lg p-6 text-center shadow-lg"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-3 flex items-center justify-center w-16 h-16">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-blue-100">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default ScholarshipHighlights;
