import { FaBook, FaGraduationCap, FaUsers, FaDollarSign } from "react-icons/fa";
import { FaArrowRight, FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";

const scholarships = [
  {
    id: 1,
    name: "STEM Excellence Scholarship",
    amount: 10000,
    applicants: 150,
    deadline: "2025-06-30",
  },
  {
    id: 2,
    name: "Future Leaders Grant",
    amount: 7500,
    applicants: 200,
    deadline: "2025-07-15",
  },
  {
    id: 3,
    name: "Global Perspectives Fund",
    amount: 15000,
    applicants: 100,
    deadline: "2025-08-01",
  },
  {
    id: 4,
    name: "Arts and Humanities Award",
    amount: 5000,
    applicants: 75,
    deadline: "2025-07-31",
  },
];

const recentApplicants = [
  {
    id: 1,
    name: "Alice Johnson",
    course: "Agriculture",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Bob Smith",
    course: "Engineering",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Carol Williams",
    course: "Doctor",
    avatar: "/placeholder.svg",
  },
];
const ScholershipStatic = () => {
  return (
    <div className="bg-gray-100">
      <div className="min-h-screen  p-8 mt-12">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Scholarship Program Management Hub
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h2 className="text-sm font-medium">Total Scholarships</h2>
                <FaBook className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h2 className="text-sm font-medium">Total Applicants</h2>
                <FaUsers className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">
                  +10% from last month
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h2 className="text-sm font-medium">Funds Allocated</h2>
                <FaDollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">$1.2M</div>
                <p className="text-xs text-muted-foreground">
                  +18% from last year
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h2 className="text-sm font-medium">Success Rate</h2>
                <FaGraduationCap className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last year
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Active Scholarships
                </h2>
                <div className="space-y-4">
                  {scholarships.map((scholarship) => (
                    <div
                      key={scholarship.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow"
                    >
                      <div>
                        <h3 className="font-semibold">{scholarship.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Deadline: {scholarship.deadline}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          ${scholarship.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {scholarship.applicants} applicants
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to={"/aallScholership"}>
                  <button className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg">
                    View All Scholarships
                  </button>
                </Link>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Recent Applicants
                </h2>
                <div className="space-y-4">
                  {recentApplicants.map((applicant) => (
                    <div
                      key={applicant.id}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">
                          {applicant.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{applicant.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {applicant.course}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Application Statistics
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold">
                        Undergraduate
                      </span>
                      <span className="text-sm font-semibold">72%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "72%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold">Graduate</span>
                      <span className="text-sm font-semibold">28%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "28%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Top Fields of Study
              </h2>
              <div className="space-y-4">
                {["Agriculture", "Engineering", "Doctor"].map(
                  (field, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-full flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{field}</span>
                          <span className="text-sm font-medium">
                            {90 - index * 10}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${90 - index * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Application Trends</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaArrowUp className="mr-2 h-4 w-4 text-green-500" />
                  <span className="font-semibold">International Students</span>
                  <span className="ml-auto text-green-500">+12%</span>
                </div>
                <div className="flex items-center">
                  <FaArrowUp className="mr-2 h-4 w-4 text-green-500" />
                  <span className="font-semibold">STEM Fields</span>
                  <span className="ml-auto text-green-500">+8%</span>
                </div>
                <div className="flex items-center">
                  <FaArrowRight className="mr-2 h-4 w-4 text-red-500" />
                  <span className="font-semibold">Humanities</span>
                  <span className="ml-auto text-red-500">-3%</span>
                </div>
                <div className="flex items-center">
                  <FaArrowUp className="mr-2 h-4 w-4 text-green-500" />
                  <span className="font-semibold">
                    First-Generation Students
                  </span>
                  <span className="ml-auto text-green-500">+15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholershipStatic;
