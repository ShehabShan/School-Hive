export const QUESTION_CATEGORIES = [
  { value: "scholarships-financial-aid", label: "Scholarships & Financial Aid" },
  { value: "visa-application-process", label: "Visa & Application Process" },
  { value: "university-program-selection", label: "University & Program Selection" },
  { value: "test-prep", label: "Test Prep" },
  { value: "campus-life-culture-shock", label: "Campus Life & Culture Shock" },
  { value: "careers-internships-abroad", label: "Careers & Internships Abroad" },
  { value: "country-specific", label: "Country-Specific" },
];

export const QUESTION_TAGS = [
  "ielts","toefl","pte","duolingo-english-test","gre","gmat","sat","act",
  "canada","usa","uk","germany","australia","netherlands","ireland","new-zealand","sweden","japan","south-korea","malaysia",
  "bangladesh","india","pakistan","nepal","sri-lanka","cbse","icse","national-curriculum-bd","a-level","o-level",
  "bachelors","masters","phd","diploma","foundation-year",
  "scholarship","fully-funded","partial-funding","tuition-waiver","assistantship",
  "visa","student-visa","i-20","cas-letter","blocked-account","biometrics","embassy-interview","offer-letter","conditional-offer",
  "sop","lor","cv-resume","gpa-conversion","backlogs","gap-year",
  "part-time-work","opt-cpt","co-op","accommodation","culture-shock",
];

export const QUESTION_LANGUAGES = [
  { value: "english", label: "English" },
  { value: "bengali", label: "বাংলা (Bengali)" },
  { value: "hindi", label: "हिन्दी (Hindi)" },
  { value: "mixed", label: "Mixed (Banglish/Hinglish)" },
];

export const STUDY_LEVELS = ["bachelors","masters","phd","diploma","foundation-year"];

export const PRIVILEGE_LADDER = [
  { rep: 1, label: "Ask, answer, and comment on your own posts" },
  { rep: 15, label: "Upvote answers" },
  { rep: 75, label: "Comment on any post" },
  { rep: 125, label: "Downvote (reason required)" },
  { rep: 300, label: "Suggest edits (applied directly)" },
  { rep: 750, label: "Access the flagged-content review queue" },
  { rep: 1500, label: "Vote to merge duplicate questions" },
];

export const COUNTRIES = [
  { value: "Canada", label: "Canada", flag: "🇨🇦" },
  { value: "USA", label: "United States", flag: "🇺🇸" },
  { value: "UK", label: "United Kingdom", flag: "🇬🇧" },
  { value: "Germany", label: "Germany", flag: "🇩🇪" },
  { value: "Australia", label: "Australia", flag: "🇦🇺" },
  { value: "Netherlands", label: "Netherlands", flag: "🇳🇱" },
  { value: "Ireland", label: "Ireland", flag: "🇮🇪" },
  { value: "New Zealand", label: "New Zealand", flag: "🇳🇿" },
  { value: "Sweden", label: "Sweden", flag: "🇸🇪" },
  { value: "Japan", label: "Japan", flag: "🇯🇵" },
  { value: "South Korea", label: "South Korea", flag: "🇰🇷" },
  { value: "Malaysia", label: "Malaysia", flag: "🇲🇾" },
  { value: "Bangladesh", label: "Bangladesh", flag: "🇧🇩" },
  { value: "India", label: "India", flag: "🇮🇳" },
  { value: "Pakistan", label: "Pakistan", flag: "🇵🇰" },
  { value: "Nepal", label: "Nepal", flag: "🇳🇵" },
  { value: "Sri Lanka", label: "Sri Lanka", flag: "🇱🇰" },
];

export const HOME_BOARDS = [
  "National Curriculum (BD)",
  "CBSE",
  "ICSE",
  "State Board (India)",
  "A-Level",
  "O-Level",
  "Pakistan — Federal Board",
  "Nepal — NEB",
  "Sri Lanka — Edexcel",
];

export function tagLabel(slug){
  const acronyms = new Set(["ielts","toefl","pte","gre","gmat","sat","act","sop","lor"]);
  if(acronyms.has(slug)) return slug.toUpperCase();
  if(slug==="duolingo-english-test") return "Duolingo English Test";
  return slug.split("-").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ");
}
