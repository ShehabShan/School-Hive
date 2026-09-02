import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ScholarshipForm from "../../../Component/scholarship/ScholarshipForm";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function AddScholarship() {
  const { user } = useAuth();
  const { isInstitution } = useRole();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    // data from zod form + deadline already formatted
    // need to handle file uploads via DOM FormData (since files not in zod data)
    const formEl = document.querySelector("form");
    const formData = new FormData(formEl);
    const payload = { ...data };

    // cover image — fixed FormData for imgbb
    const coverFile = formData.get("universityImage");
    if (coverFile && coverFile.name) {
      try {
        const fd = new FormData();
        fd.append("image", coverFile);
        const res = await axiosPublic.post(image_hosting_api, fd);
        payload.universityImage = res.data.data.display_url || res.data.data.url;
      } catch (err) {
        toast.error(`Cover upload failed: ${err?.response?.data?.error?.message || err.message}`);
        return;
      }
    } else {
      payload.universityImage = "https://placehold.co/600x400?text=Scholarship";
    }

    // gallery — fixed FormData
    const galleryFiles = formData.getAll("galleryFiles");
    const galleryUrls = [];
    for (const f of galleryFiles) {
      if (f && f.name && f.size > 0) {
        try {
          const fd = new FormData();
          fd.append("image", f);
          const res = await axiosPublic.post(image_hosting_api, fd);
          galleryUrls.push(res.data.data.display_url || res.data.data.url);
        } catch (err) {
          toast.error(`Gallery ${f.name} failed: ${err?.response?.data?.error?.message || ""}`);
        }
      }
    }
    if (galleryUrls.length) payload.gallery = galleryUrls;
    else if (data.galleryUrls) payload.gallery = data.galleryUrls.split(",").map((s) => s.trim()).filter(Boolean);

    // normalize arrays
    ["eligibility", "benefits", "tags", "highlights", "documents", "requirements"].forEach((k) => {
      if (payload[k] !== undefined) payload[k] = String(payload[k] || "").split(",").map((s) => s.trim()).filter(Boolean);
    });
    payload.currency = (payload.currency || "USD").toUpperCase().slice(0, 3);
    payload.videoUrl = String(payload.videoUrl || "").trim() || null;
    payload.videoPoster = String(payload.videoPoster || "").trim() || null;
    payload.brochureUrl = String(payload.brochureUrl || "").trim() || null;
    payload.mapUrl = String(payload.mapUrl || "").trim() || null;
    if (payload.faqs) {
      const raw = String(payload.faqs).trim();
      try {
        payload.faqs = JSON.parse(raw);
      } catch {
        payload.faqs = raw.split("|").map((pair) => { const [q, a] = pair.split("=>"); return q && a ? { q: q.trim(), a: a.trim() } : null; }).filter(Boolean);
      }
    }
    // cleanup helper fields
    delete payload.galleryUrls;

    payload.postDate = format(new Date(), "yyyy-MM-dd");
    payload.email = user?.email;
    payload.rating = 0;
    payload.Feedback = "";
    // numbers coerced by zod, but ensure
    if (payload.stipend === "") delete payload.stipend;

    const isDraft = payload.status === "draft";
    const isScheduled = payload.status === "scheduled";
    try {
      await axiosSecure.post("/allScholership", payload);
      if (isDraft) toast.success("Draft saved!");
      else if (isScheduled) toast.success(`Scheduled for ${new Date(payload.publishAt).toLocaleString()}!`);
      else toast.success("Scholarship published!");
      navigate(isInstitution ? "/institutionDashboard/manageScholarships" : "/adminDashboard/manageScholarships", { replace: true });
    } catch (e) {
      toast.error(e?.response?.data?.message || (isDraft ? "Failed to save draft" : isScheduled ? "Failed to schedule" : "Failed to publish"));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 md:p-6">
      <ScholarshipForm onSubmit={handleCreate} submitLabel="Publish Scholarship" imageRequired />
    </div>
  );
}
