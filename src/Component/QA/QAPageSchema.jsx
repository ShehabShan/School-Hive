export default function QAPageSchema({ question }){
  if(!question) return null;
  const baseURL = typeof window !== "undefined" ? window.location.origin : "https://scholarhive-913e4.web.app";
  const qUrl = `${baseURL}/questions/${question._id}`;
  const accepted = question.acceptedAnswer || (question.answers||[]).find(a=>a.accepted) || null;
  const data = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": question.title,
      "text": String(question.body||"").slice(0, 5000),
      "author": { "@type": "Person", "name": question.authorEmail || "Anonymous" },
      "datePublished": question.createdAt ? new Date(question.createdAt).toISOString() : new Date().toISOString(),
      "dateModified": question.updatedAt ? new Date(question.updatedAt).toISOString() : new Date(question.createdAt||Date.now()).toISOString(),
      "upvoteCount": question.voteScore ?? 0,
      "answerCount": (question.answers||[]).length,
      "url": qUrl,
      ...(accepted ? {
        "acceptedAnswer": {
          "@type": "Answer",
          "text": String(accepted.body||"").slice(0,5000),
          "author": { "@type": "Person", "name": accepted.authorEmail || "Anonymous" },
          "upvoteCount": accepted.voteScore ?? 0,
          "datePublished": accepted.createdAt ? new Date(accepted.createdAt).toISOString() : undefined,
          "url": `${qUrl}#answer-${accepted._id}`
        }
      } : {}),
      "suggestedAnswer": (question.answers||[]).filter(a=>!a.accepted).slice(0,3).map(a=>({
        "@type": "Answer",
        "text": String(a.body||"").slice(0,5000),
        "author": { "@type": "Person", "name": a.authorEmail || "Anonymous" },
        "upvoteCount": a.voteScore ?? 0,
        "datePublished": a.createdAt ? new Date(a.createdAt).toISOString() : undefined,
        "url": `${qUrl}#answer-${a._id}`
      }))
    }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
