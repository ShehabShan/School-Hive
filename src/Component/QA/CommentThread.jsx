export default function CommentThread({ answerId }){
  return <div className="text-xs opacity-60 mt-2">Comments for {String(answerId).slice(0,6)} — threaded comments land as follow-up research (placeholder).</div>;
}
