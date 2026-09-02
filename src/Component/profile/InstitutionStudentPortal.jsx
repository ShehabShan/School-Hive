import { useState } from "react";
import { Users, Plus, Upload, Search, Trash2, Edit3, GraduationCap } from "lucide-react";
import { useInstitutionStudents, useAddStudent, useBulkAddStudents, useDeleteStudent, useUpdateStudent } from "../../Hooks/useInstitutionStudents";
import EmptyState from "../ui/EmptyState";
import Spinner from "../ui/Spinner";

export default function InstitutionStudentPortal({ institutionEmail }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useInstitutionStudents(institutionEmail, { q: q || undefined, page, limit: 10 });
  const students = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const addMut = useAddStudent();
  const bulkMut = useBulkAddStudents();
  const delMut = useDeleteStudent();
  const updMut = useUpdateStudent();

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ studentName: "", studentEmail: "", department: "", program: "", year: "", rollId: "" });
  const [csvPreview, setCsvPreview] = useState([]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (editing) {
      await updMut.mutateAsync({ institutionEmail, id: editing._id, payload: form });
      setEditing(null);
    } else {
      await addMut.mutateAsync({ institutionEmail, payload: form });
    }
    setForm({ studentName: "", studentEmail: "", department: "", program: "", year: "", rollId: "" });
    setShowAdd(false);
  };

  const handleCsv = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = String(text).split(/\r?\n/).filter(Boolean);
      const header = lines[0]?.toLowerCase();
      const hasHeader = header?.includes("name") && header?.includes("email");
      const rows = (hasHeader ? lines.slice(1) : lines).slice(0, 50).map(line => {
        const cols = line.split(/[,;\t]/).map(s=> s.trim().replace(/^"|"$/g,""));
        // try map: name,email,department,program,year,rollId
        return { studentName: cols[0]||"", studentEmail: cols[1]||"", department: cols[2]||"", program: cols[3]||"", year: cols[4]||"", rollId: cols[5]||"" };
      }).filter(r=> r.studentName && r.studentEmail);
      setCsvPreview(rows);
    };
    reader.readAsText(file);
  };

  const commitCsv = async () => {
    if (!csvPreview.length) return;
    await bulkMut.mutateAsync({ institutionEmail, students: csvPreview });
    setCsvPreview([]);
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900"><Users className="h-4 w-4 text-violet-600" /> Students <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{total}</span></h3>
        <div className="flex gap-2">
          <button onClick={()=> setShowAdd(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-violet-700"><Plus className="h-3.5 w-3.5" /> Add Student</button>
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"><Upload className="h-3.5 w-3.5" /> Import CSV<input type="file" accept=".csv,.txt" onChange={handleCsv} className="hidden" /></label>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <Search className="h-4 w-4 text-slate-400" />
        <input value={q} onChange={(e)=> { setQ(e.target.value); setPage(1); }} placeholder="Search name, email, department..." className="w-full bg-transparent text-sm outline-none" />
      </div>

      {csvPreview.length > 0 && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-bold text-amber-800">CSV Preview — {csvPreview.length} rows</p>
          <p className="text-[11px] text-amber-700">Columns: name, email, department, program, year, rollId — first 3 shown</p>
          <div className="mt-2 space-y-1">
            {csvPreview.slice(0,3).map((r,i)=> <p key={i} className="text-xs text-slate-700">{r.studentName} — {r.studentEmail} • {r.department}</p>)}
          </div>
          <div className="mt-2 flex gap-2">
            <button onClick={commitCsv} disabled={bulkMut.isPending} className="rounded-lg bg-amber-600 px-3 py-1 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50">{bulkMut.isPending ? "Importing..." : "Confirm Import"}</button>
            <button onClick={()=> setCsvPreview([])} className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? <div className="py-10 flex justify-center"><Spinner className="h-6 w-6 text-violet-600" /></div> : students.length === 0 ? (
        <div className="mt-4"><EmptyState icon={GraduationCap} title="No students yet" description="Add students manually or import a CSV to build your campus roster." /></div>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-slate-500"><th className="py-2 font-semibold">Name</th><th className="font-semibold">Email</th><th className="font-semibold hidden sm:table-cell">Dept</th><th className="font-semibold hidden sm:table-cell">Year</th><th className="font-semibold">Actions</th></tr></thead>
              <tbody>
                {students.map((s)=> (
                  <tr key={s._id} className="border-t border-slate-100">
                    <td className="py-2.5 font-semibold text-slate-900">{s.studentName}</td>
                    <td className="text-slate-600 text-xs sm:text-sm">{s.studentEmail}</td>
                    <td className="hidden sm:table-cell text-slate-600">{s.department || "—"}</td>
                    <td className="hidden sm:table-cell text-slate-600">{s.year || "—"}</td>
                    <td className="flex gap-1 py-2">
                      <button onClick={()=> { setEditing(s); setForm({ studentName: s.studentName, studentEmail: s.studentEmail, department: s.department||"", program: s.program||"", year: s.year||"", rollId: s.rollId||"" }); setShowAdd(true); }} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"><Edit3 className="h-3.5 w-3.5" /></button>
                      <button onClick={()=> delMut.mutate({ institutionEmail, id: s._id })} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <button disabled={page<=1} onClick={()=> setPage(p=> Math.max(1,p-1))} className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold disabled:opacity-40">Prev</button>
              <span className="text-xs text-slate-500">Page {page} / {totalPages}</span>
              <button disabled={page>=totalPages} onClick={()=> setPage(p=> p+1)} className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={()=> { setShowAdd(false); setEditing(null); }}>
          <form onSubmit={handleAdd} onClick={(e)=> e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h4 className="text-base font-bold text-slate-900">{editing ? "Edit Student" : "Add Student"}</h4>
            <div className="mt-4 space-y-3">
              <label className="block"><span className="text-xs font-semibold text-slate-700">Name *</span><input value={form.studentName} onChange={(e)=> setForm(f=>({...f,studentName:e.target.value}))} required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
              <label className="block"><span className="text-xs font-semibold text-slate-700">Email *</span><input type="email" value={form.studentEmail} onChange={(e)=> setForm(f=>({...f,studentEmail:e.target.value}))} required disabled={!!editing} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="text-xs font-semibold text-slate-700">Department</span><input value={form.department} onChange={(e)=> setForm(f=>({...f,department:e.target.value}))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
                <label className="block"><span className="text-xs font-semibold text-slate-700">Program</span><input value={form.program} onChange={(e)=> setForm(f=>({...f,program:e.target.value}))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="text-xs font-semibold text-slate-700">Year</span><input value={form.year} onChange={(e)=> setForm(f=>({...f,year:e.target.value}))} placeholder="2024" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
                <label className="block"><span className="text-xs font-semibold text-slate-700">Roll ID</span><input value={form.rollId} onChange={(e)=> setForm(f=>({...f,rollId:e.target.value}))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button type="submit" disabled={addMut.isPending || updMut.isPending} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-50">{editing ? "Save" : "Add"}</button>
              <button type="button" onClick={()=> { setShowAdd(false); setEditing(null); }} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
