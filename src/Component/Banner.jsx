import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// import img1 from "../assist/image/university6.png";
// import img2 from "../assist/image/university3.png";
// import img3 from "../assist/image/university8.png";
// import img4 from "../assist/image/university9.png";
// import img5 from "../assist/image/university10.png";
// import img6 from "../assist/image/university4.png";

import freepik1 from "../assist/image/freepeak/freepik1.png";
import freepik2 from "../assist/image/freepeak/freepik2.png";
import freepik3 from "../assist/image/freepeak/freepik3.png";
import freepik4 from "../assist/image/freepeak/freepik4.png";
import freepik5 from "../assist/image/freepeak/freepik5.png";
import freepik6 from "../assist/image/freepeak/freepik1.png";

const Banner = () => {
  return (
    <div>
      <Carousel>
        <div>
          <img src={freepik1} />
        </div>
        <div>
          <img src={freepik2} />
        </div>
        <div>
          <img src={freepik3} />
        </div>
        <div>
          <img src={freepik4} />
        </div>
        <div>
          <img src={freepik5} />
        </div>
        <div>
          <img src={freepik6} />
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
