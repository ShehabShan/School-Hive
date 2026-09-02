import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ScholarshipForm from "../../../Component/scholarship/ScholarshipForm";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useRole from "../../../Hooks/useRole";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function EditScholarship() {
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { isInstitution } = useRole();

  useEffect(() => {
    axiosPublic.get(`/allScholership/${id}`).then((res) => {
      const d = res.data.data || res.data;
      setInitial({
        universityName: d.universityName || "",
        scholarshipName: d.scholarshipName || d.subjectName || "",
        country: d.country || "",
        city: d.city || "",
        universityWorldrank: d.universityWorldrank || "",
        stipend: d.stipend || "",
        scholarshipCategory: d.scholarshipCategory || "Partial",
        subjectName: d.subjectName || "",
        degree: d.degree || "Diploma",
        currency: d.currency || "USD",
        duration: d.duration || "",
        eligibility: Array.isArray(d.eligibility) ? d.eligibility.join(", ") : d.eligibility || "",
        benefits: Array.isArray(d.benefits) ? d.benefits.join(", ") : d.benefits || "",
        tags: Array.isArray(d.tags) ? d.tags.join(", ") : d.tags || "",
        highlights: Array.isArray(d.highlights) ? d.highlights.join(", ") : d.highlights || "",
        documents: Array.isArray(d.documents) ? d.documents.join(", ") : d.documents || "",
        requirements: Array.isArray(d.requirements) ? d.requirements.join(", ") : d.requirements || "",
        scholarshipDescription: d.scholarshipDescription || "",
        galleryUrls: Array.isArray(d.gallery) ? d.gallery.join(", ") : "",
        videoUrl: d.videoUrl || "",
        videoPoster: d.videoPoster || "",
        brochureUrl: d.brochureUrl || "",
        mapUrl: d.mapUrl || "",
        faqs: Array.isArray(d.faqs) ? JSON.stringify(d.faqs, null, 2) : "",
        serviceCharge: d.serviceCharge || "",
        applicationFees: d.applicationFees || "",
        applicationDeadline: d.applicationDeadline || "",
        publishAt: d.publishAt || "",
        showScheduledOnProfile: !!d.showScheduledOnProfile,
        status: d.status || "published",
        _raw: d,
      });
    });
  }, [id, axiosPublic]);

  const handleUpdate = async (data) => {
    const formEl = document.querySelector("form");
    const formData = new FormData(formEl);
    const payload = { ...data };

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
      delete payload.universityImage;
    }

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
    else if (initial?._raw?.gallery) payload.gallery = initial._raw.gallery;

    ["eligibility", "benefits", "tags", "highlights", "documents", "requirements"].forEach((k) => {
      if (payload[k] !== undefined) payload[k] = String(payload[k] || "").split(",").map((s) => s.trim()).filter(Boolean);
    });
    payload.currency = String(payload.currency || "USD").toUpperCase().slice(0, 3);
    payload.videoUrl = String(payload.videoUrl || "").trim() || null;
    payload.videoPoster = String(payload.videoPoster || "").trim() || null;
    payload.brochureUrl = String(payload.brochureUrl || "").trim() || null;
    payload.mapUrl = String(payload.mapUrl || "").trim() || null;
    if (payload.faqs) {
      const raw = String(payload.faqs).trim();
      if (raw) {
        try { payload.faqs = JSON.parse(raw); } catch { payload.faqs = raw.split("|").map((pair) => { const [q, a] = pair.split("=>"); return q && a ? { q: q.trim(), a: a.trim() } : null; }).filter(Boolean); }
      } else delete payload.faqs;
    }
    delete payload.galleryUrls;
    delete payload._raw;
    payload.applicationDeadline = data.applicationDeadline || initial?.applicationDeadline;

    const isDraft = payload.status === "draft";
    try {
      const { data: res } = await axiosSecure.patch(`/allScholership/${id}`, payload);
      if (res.data?.modifiedCount > 0 || res.modifiedCount > 0) toast.success(isDraft ? "Draft updated!" : "Scholarship updated!");
      else toast.success(isDraft ? "Draft saved!" : "Saved");
      navigate(isInstitution ? "/institutionDashboard/manageScholarships" : "/adminDashboard/manageScholarships");
    } catch (e) {
      toast.error(e?.response?.data?.message || (isDraft ? "Failed to save draft" : "Update failed"));
    }
  };

  if (!initial) return <div className="flex min-h-[60vh] items-center justify-center"><span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 md:p-6">
      <ScholarshipForm initialValues={initial} onSubmit={handleUpdate} submitLabel="Update Scholarship" imageRequired={false} previewImage={initial._raw?.universityImage} />
    </div>
  );
}
