import {
  BookOpen,
  Users,
  DollarSign,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../../Component/ui/StatCard";

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
  { id: 1, name: "Alice Johnson", course: "Agriculture" },
  { id: 2, name: "Bob Smith", course: "Engineering" },
  { id: 3, name: "Carol Williams", course: "Medicine" },
];

const trends = [
  { label: "International Students", value: "+12%", up: true },
  { label: "STEM Fields", value: "+8%", up: true },
  { label: "Humanities", value: "-3%", up: false },
  { label: "First-Generation Students", value: "+15%", up: true },
];

const fields = [
  { label: "Agriculture", value: 90 },
  { label: "Engineering", value: 80 },
  { label: "Medicine", value: 70 },
];

const ScholershipStatic = () => {
  return (
    <section className="bg-white">
      <div className="container-page py-20 md:py-24">
        <div className="section-title">
          <span className="eyebrow">Insights</span>
          <h2>Scholarship Program Hub</h2>
          <p>
            A live overview of the platform, from funds allocated to trending
            fields of study.
          </p>
        </div>

        {/* Stat cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={BookOpen}
            label="Total Scholarships"
            value="24"
            trend="+2 from last month"
            accent="brand"
          />
          <StatCard
            icon={Users}
            label="Total Applicants"
            value="1,284"
            trend="+10% from last month"
            accent="sky"
          />
          <StatCard
            icon={DollarSign}
            label="Funds Allocated"
            value="$1.2M"
            trend="+18% from last year"
            accent="emerald"
          />
          <StatCard
            icon={GraduationCap}
            label="Success Rate"
            value="89%"
            trend="+5% from last year"
            accent="amber"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Active scholarships */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Active Scholarships
              </h3>
              <Link
                to="/allScholership"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {scholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition-shadow hover:shadow-soft"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {scholarship.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Deadline: {scholarship.deadline}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      ${scholarship.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">
                      {scholarship.applicants} applicants
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <h3 className="mb-5 text-lg font-bold text-slate-900">
                Recent Applicants
              </h3>
              <div className="space-y-4">
                {recentApplicants.map((applicant) => (
                  <div key={applicant.id} className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                      {applicant.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {applicant.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {applicant.course}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <h3 className="mb-5 text-lg font-bold text-slate-900">
                Application Trends
              </h3>
              <div className="space-y-3">
                {trends.map((trend) => (
                  <div key={trend.label} className="flex items-center gap-2">
                    {trend.up ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-rose-500" />
                    )}
                    <span className="text-sm font-medium text-slate-600">
                      {trend.label}
                    </span>
                    <span
                      className={`ml-auto text-sm font-bold ${
                        trend.up ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {trend.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top fields */}
        <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <h3 className="mb-5 text-lg font-bold text-slate-900">
            Top Fields of Study
          </h3>
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-3">
            {fields.map((field) => (
              <div key={field.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {field.label}
                  </span>
                  <span className="font-bold text-brand-600">
                    {field.value}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
                    style={{ width: `${field.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScholershipStatic;
