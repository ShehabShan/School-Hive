import { FaMailBulk, FaCalendarAlt, FaUser, FaBookOpen } from "react-icons/fa";
import StatusBadge from "../../../Component/ui/StatusBadge";

export default function ApplicationDetails({ data }) {
  if (!data) return null;
  const totalFees = Number(data?.applicationFees) + Number(data?.serviceCharge);
  const infoRows = [
    { icon: FaMailBulk, label: "Email", value: data?.email },
    { icon: FaCalendarAlt, label: "Posted", value: data?.postDate },
    { icon: FaBookOpen, label: "Subject", value: data?.subjectName },
    { icon: FaUser, label: "Scholarship", value: `${data?.scholarshipCategory} Scholarship` },
    { icon: FaUser, label: "Degree", value: data?.applyingDegree || data?.Postgraduate || "—" },
    { icon: FaMailBulk, label: "District", value: data?.applicantDistrict || "—" },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 ring-1 ring-slate-100">
              <img src={data?.universityImage} alt="University" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900 truncate">{data?.name}</h3>
              <p className="text-sm text-slate-500 truncate">{data?.email}</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{data?.universityName}</p>
            </div>
            <div className="ml-auto hidden md:block">
              <StatusBadge status={data?.applicationStatus} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {infoRows.map((row) => (
              <div key={row.label} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-500 shadow-soft ring-1 ring-slate-100">
                  <row.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{row.label}</p>
                  <p className="truncate text-sm font-semibold text-slate-700">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-72">
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-5 ring-1 ring-slate-100">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Fee Summary</h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600"><span>Application Fee</span><span className="font-semibold">${data?.applicationFees}</span></div>
              <div className="flex justify-between text-slate-600"><span>Service Charge</span><span className="font-semibold">${data?.serviceCharge}</span></div>
              <div className="my-2 border-t border-slate-200"></div>
              <div className="flex justify-between text-base font-extrabold text-brand-700"><span>Total</span><span>${totalFees}</span></div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
            <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Additional Information</h4>
            <p className="break-all text-sm text-slate-600">Scholarship ID: <span className="font-semibold">{data?.scholarship_id}</span></p>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">Status: <StatusBadge status={data?.applicationStatus} /></p>
          </div>
        </div>
      </div>

      {data?.Feedback && (
        <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-amber-700">Feedback</h4>
          <p className="text-sm leading-relaxed text-amber-800">{data?.Feedback}</p>
        </div>
      )}
    </div>
  );
}
