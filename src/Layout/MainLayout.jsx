import { Outlet } from "react-router-dom";
import Navbar from "../Pages/Sheard/Nabvar";
import Footer from "../Component/Footer";

const MainLayout = () => {
  return (
    <div className="mx-auto pt-[77px]">
      <Navbar></Navbar>
      <div className="mx-auto">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
