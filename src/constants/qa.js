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

export function tagLabel(slug){
  const acronyms = new Set(["ielts","toefl","pte","gre","gmat","sat","act","sop","lor"]);
  if(acronyms.has(slug)) return slug.toUpperCase();
  if(slug==="duolingo-english-test") return "Duolingo English Test";
  return slug.split("-").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ");
}
