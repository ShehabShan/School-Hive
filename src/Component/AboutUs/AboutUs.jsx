import img1 from "../../assist/image/AboutUs/student1.jpg";
import img2 from "../../assist/image/AboutUs/student2.jpg";
import img3 from "../../assist/image/AboutUs/student4.png";

export default function AboutUs() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 py-16">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column - Text Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <span className="text-red-600 font-medium">About Us</span>
            <h1 className="text-4xl font-bold leading-tight">
              Experience in School Leadership & Teaching
            </h1>
            <p className="text-gray-600">
              Mauris sit amet lacinia est, vitae tristique metus. Nulla
              facilisi. Mauris tempor nibh vitae pulvinar ultricies. Sed
              malesuada placerat metus. Vivamus sagittis arcu eu elit semper,
              eget varius turpis posuere. Suspendisse ac nibh cursus, dignissim
              urna a, porttitor nisi.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={img1}
                  alt="Vice Principal"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h3 className="font-semibold">Hugh Millie-Yate</h3>
                <p className="text-gray-600 text-sm">Vice Principal</p>
              </div>
            </div>
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Signature"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        {/* Right Column - imgs */}
        <div className="relative flex items-center">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3 relative">
              <img
                src={img3}
                alt="Students studying together"
                width={320}
                height={360}
                className="rounded-lg w-[200px] h-[350px] lg:w-[260px] lg:h-[360px] lg:mt-10 lg:ml-16"
              />
              {/* Red arrow connection */}
              <div className="absolute  hidden lg:flex lg:right-3 top-1/2 -translate-y-1/2">
                <svg
                  width="40"
                  height="24"
                  viewBox="0 0 40 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 12H36M36 12L26 2M36 12L26 22"
                    stroke="#DC2626"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            <div className="col-span-2">
              <img
                src={img2}
                alt="Teacher in library"
                width={320}
                height={360}
                className="rounded-lg w-[200px] h-[350px]  lg:h-[360px] lg:w-[260px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
