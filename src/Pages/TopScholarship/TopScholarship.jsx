import { Link } from "react-router-dom";
import useScholership from "../../Hooks/useScholership";
import ScholarshipCard from "../AllScholership/ScholarshipCard";

const TopScholarship = () => {
  const [allScholership] = useScholership();
  const topScholarships = allScholership.slice(0, 6);
  console.log(allScholership);

  return (
    <div className="bg-[#f3f4f6] ">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="text-3xl text-black font-bold text-center mb-6 mt-10">
          Top Scholership
        </h2>
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-7">
          {topScholarships.map((scholarship, index) => (
            <ScholarshipCard
              key={index}
              scholarship={scholarship}
            ></ScholarshipCard>
          ))}
        </div>
        <div className="my-7 block text-center">
          <Link to={`/allScholership`}>
            <button className="btn  btn-primary text-2xl px-16 bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-none hover:from-indigo-600 hover:to-blue-700">
              See All Scholership
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopScholarship;
