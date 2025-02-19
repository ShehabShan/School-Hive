import { createBrowserRouter } from "react-router-dom";

import Home from "../Layout/Home";
import MainLayout from "../Layout/MainLayout";
import Login from "../Pages/Authentication/Login";
import AdminDashboard from "../Layout/AdminDashboard";
import MyProfile from "../Pages/UserPage/MyProfile/MyProfile";
import MyApplication from "../Pages/UserPage/MyApplication/MyApplication";
import MyReviews from "../Pages/UserPage/MyReviews/MyReviews";
import ManageScholarships from "../Pages/ModaratorPages/ManageScholarships/ManageScholarships";
import AllAppliedScholarship from "../Pages/ModaratorPages/AllAppliedScholarship/AllAppliedScholarship";
import AddScholarship from "../Pages/ModaratorPages/AddScholarship/AddScholarship";
import ManageAppliedApplication from "../Pages/AdminPages/ManageAppliedApplication/ManageAppliedApplication";
import ManageUsers from "../Pages/AdminPages/ManageUsers/ManageUsers";
import ManageReview from "../Pages/AdminPages/ManageReviews/ManageReview";
import AllScholership from "../Pages/AllScholership/AllScholership";
import ScholarshipDetails from "../Pages/ScholarshipDetails/ScholarshipDetails";
import EditScholarship from "../Pages/ModaratorPages/ManageScholarships/EditScholarship";
import Registation from "../Pages/Authentication/Registation";
import PrivateRoute from "./PrivetRouter";
import ModaretorRoute from "./ModaretorRoute";
import AdminRoute from "./AdminRoute";
import Apply from "../Pages/UserPage/Apply/Apply";
import ContactPage from "../Pages/Contact/ContactPage";
import NotFound from "../Component/ErrorPage/NotFound";
import ApplicationCard from "../Pages/ModaratorPages/AllAppliedScholarship/ViewDetails/ApplicationCard";
import ApplicationCardForUser from "../Pages/UserPage/MyApplication/ApplicationCardForUser";
import AddReview from "../Pages/AddReview/AddReview";
import UserRoute from "./UserRoute";
import AboutUs from "../Component/AboutUs/AboutUs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound></NotFound>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "allScholership",
        element: <AllScholership></AllScholership>,
      },
      {
        path: "allScholership/:id",
        element: <ScholarshipDetails></ScholarshipDetails>,
      },

      {
        path: "apply/:id",
        element: (
          <PrivateRoute>
            <Apply></Apply>
          </PrivateRoute>
        ),
      },

      {
        path: "myProfile",
        element: <MyProfile></MyProfile>,
      },

      {
        path: "contact",
        element: <ContactPage></ContactPage>,
      },
      {
        path: "aboutUs",
        element: <AboutUs></AboutUs>,
      },

      {
        path: "signIn",
        element: <Login></Login>,
      },
      {
        path: "registration",
        element: <Registation></Registation>,
      },
    ],
  },
  {
    path: "userDashboard",
    element: (
      <UserRoute>
        <AdminDashboard></AdminDashboard>
      </UserRoute>
    ),
    children: [
      {
        path: "myProfile",
        element: <MyProfile></MyProfile>,
      },
      {
        path: "myApplication",
        element: <MyApplication></MyApplication>,
      },
      {
        path: "myApplication/:id",
        element: <ApplicationCardForUser></ApplicationCardForUser>,
      },
      {
        path: "myApplication/addReviews/:id",
        element: <AddReview></AddReview>,
      },
      {
        path: "myReviews",
        element: <MyReviews></MyReviews>,
      },
    ],
  },
  {
    path: "modaratorDashboard",
    element: (
      <ModaretorRoute>
        <AdminDashboard></AdminDashboard>
      </ModaretorRoute>
    ),
    children: [
      {
        path: "myProfile",
        element: <MyProfile></MyProfile>,
      },
      {
        path: "manageScholarships",
        element: <ManageScholarships></ManageScholarships>,
      },
      {
        path: "manageScholarships/:id",
        element: <EditScholarship></EditScholarship>,
      },
      {
        path: "myReviews",
        element: <ManageReview></ManageReview>,
      },
      {
        path: "allAppliedScholarships",
        element: <AllAppliedScholarship></AllAppliedScholarship>,
      },
      {
        path: "allAppliedScholarships/:id",
        element: <ApplicationCard></ApplicationCard>,
      },
      {
        path: "addScholarships",
        element: <AddScholarship></AddScholarship>,
      },
    ],
  },
  {
    path: "adminDashboard",
    element: (
      <AdminRoute>
        <AdminDashboard></AdminDashboard>
      </AdminRoute>
    ),
    children: [
      {
        path: "adminProfile",
        element: <MyProfile></MyProfile>,
      },
      {
        path: "addScholarships",
        element: <AddScholarship></AddScholarship>,
      },
      {
        path: "manageScholarships",
        element: <ManageScholarships></ManageScholarships>,
      },
      {
        path: "manageScholarships/:id",
        element: <EditScholarship></EditScholarship>,
      },
      {
        path: "manageAppliedApplication",
        element: <ManageAppliedApplication></ManageAppliedApplication>,
      },
      {
        path: "allAppliedScholarships/:id",
        element: <ApplicationCard></ApplicationCard>,
      },
      {
        path: "manageUsers",
        element: <ManageUsers></ManageUsers>,
      },
      {
        path: "manageReviews",
        element: <ManageReview></ManageReview>,
      },
    ],
  },
]);

export default router;
