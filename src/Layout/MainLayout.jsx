import { Outlet } from "react-router-dom";
import Navbar from "../Pages/Sheard/Nabvar";

const MainLayout = () => {
  return (
    <div className="mx-auto pt-[77px]">
      <Navbar></Navbar>
      <div className="mx-auto">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default MainLayout;
