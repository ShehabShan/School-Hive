import { Outlet } from "react-router-dom";
import Navbar from "../Pages/Sheard/Nabvar";
import Footer from "../Component/Footer";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
