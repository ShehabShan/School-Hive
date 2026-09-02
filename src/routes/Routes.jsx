import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "../Layout/MainLayout";
import Home from "../Layout/Home";
import AdminDashboard from "../Layout/AdminDashboard";
import NotFound from "../Component/ErrorPage/NotFound";
import RouteFallback from "../Component/ui/RouteFallback";
import PrivateRoute from "./PrivetRouter";
import ModaretorRoute from "./ModaretorRoute";
import AdminRoute from "./AdminRoute";
import InstitutionRoute from "./InstitutionRoute";
import SuperAdminRoute from "./SuperAdminRoute";
import UserRoute from "./UserRoute";

// Lazy pages — code-split per route
const Login = lazy(() => import("../Pages/Authentication/Login"));
const Registation = lazy(() => import("../Pages/Authentication/Registation"));
const PendingApproval = lazy(() =>
  import("../Pages/Authentication/InstitutionStatus").then((m) => ({ default: m.PendingApproval }))
);
const RejectedApproval = lazy(() =>
  import("../Pages/Authentication/InstitutionStatus").then((m) => ({ default: m.RejectedApproval }))
);
const MyProfile = lazy(() => import("../Pages/UserPage/MyProfile/MyProfile"));
const MyApplication = lazy(() => import("../Pages/UserPage/MyApplication/MyApplication"));
const MyReviews = lazy(() => import("../Pages/UserPage/MyReviews/MyReviews"));
const ManageScholarships = lazy(() => import("../Pages/ModaratorPages/ManageScholarships/ManageScholarships"));
const AllAppliedScholarship = lazy(() => import("../Pages/ModaratorPages/AllAppliedScholarship/AllAppliedScholarship"));
const AddScholarship = lazy(() => import("../Pages/ModaratorPages/AddScholarship/AddScholarship"));
const ManageAppliedApplication = lazy(() => import("../Pages/AdminPages/ManageAppliedApplication/ManageAppliedApplication"));
const ManageUsers = lazy(() => import("../Pages/AdminPages/ManageUsers/ManageUsers"));
const ManageReview = lazy(() => import("../Pages/AdminPages/ManageReviews/ManageReview"));
const ReviewHistory = lazy(() => import("../Pages/AdminPages/ManageReviews/ReviewHistory"));
const AllScholership = lazy(() => import("../Pages/AllScholership/AllScholership"));
const ScholarshipDetails = lazy(() => import("../Pages/ScholarshipDetails/ScholarshipDetails"));
const EditScholarship = lazy(() => import("../Pages/ModaratorPages/ManageScholarships/EditScholarship"));
const InstitutionApprovals = lazy(() => import("../Pages/AdminPages/ManageUsers/InstitutionApprovals"));
const Apply = lazy(() => import("../Pages/UserPage/Apply/Apply"));
const ContactPage = lazy(() => import("../Pages/Contact/ContactPage"));
const ApplicationCard = lazy(() => import("../Pages/ModaratorPages/AllAppliedScholarship/ViewDetails/ApplicationCard"));
const ApplicationCardForUser = lazy(() => import("../Pages/UserPage/MyApplication/ApplicationCardForUser"));
const AddReview = lazy(() => import("../Pages/AddReview/AddReview"));
const AboutUs = lazy(() => import("../Component/AboutUs/AboutUs"));
const Compare = lazy(() => import("../Pages/Compare/Compare"));
const SavedScholarships = lazy(() => import("../Pages/UserPage/Saved/SavedScholarships"));
const PublicProfile = lazy(() => import("../Pages/PublicProfile/PublicProfile"));

// helper to wrap lazy in Suspense
const susp = (el) => <Suspense fallback={<RouteFallback />}>{el}</Suspense>;

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        { path: "allScholership", element: susp(<AllScholership />) },
        { path: "allScholership/:id", element: susp(<ScholarshipDetails />) },
        { path: "apply/:id", element: <PrivateRoute>{susp(<Apply />)}</PrivateRoute> },
        { path: "myProfile", element: <PrivateRoute>{susp(<MyProfile />)}</PrivateRoute> },
        { path: "contact", element: susp(<ContactPage />) },
        { path: "aboutUs", element: susp(<AboutUs />) },
        { path: "signIn", element: susp(<Login />) },
        { path: "registration", element: susp(<Registation />) },
        { path: "pendingApproval", element: susp(<PendingApproval />) },
        { path: "rejectedApproval", element: susp(<RejectedApproval />) },
        { path: "compare", element: susp(<Compare />) },
        { path: "saved", element: <PrivateRoute>{susp(<SavedScholarships />)}</PrivateRoute> },
        { path: "scholarships", element: susp(<AllScholership />) },
        { path: "scholarships/:id", element: susp(<ScholarshipDetails />) },
        { path: "profile/:email", element: susp(<PublicProfile />) },
      ],
    },
    {
      path: "userDashboard",
      element: <UserRoute><AdminDashboard /></UserRoute>,
      children: [
        { path: "myProfile", element: susp(<MyProfile />) },
        { path: "myApplication", element: susp(<MyApplication />) },
        { path: "myApplication/:id", element: susp(<ApplicationCardForUser />) },
        { path: "myApplication/addReviews/:id", element: susp(<AddReview />) },
        { path: "myReviews", element: susp(<MyReviews />) },
        { path: "saved", element: susp(<SavedScholarships />) },
      ],
    },
    {
      path: "modaratorDashboard",
      element: <ModaretorRoute><AdminDashboard /></ModaretorRoute>,
      children: [
        { path: "myProfile", element: susp(<MyProfile />) },
        { path: "myReviews", element: susp(<ManageReview />) },
        { path: "myReviews/history", element: susp(<ReviewHistory />) },
        { path: "allAppliedScholarships", element: susp(<AllAppliedScholarship />) },
        { path: "allAppliedScholarships/:id", element: susp(<ApplicationCard />) },
      ],
    },
    {
      path: "adminDashboard",
      element: <AdminRoute><AdminDashboard /></AdminRoute>,
      children: [
        { path: "adminProfile", element: susp(<MyProfile />) },
        { path: "addScholarships", element: <SuperAdminRoute>{susp(<AddScholarship />)}</SuperAdminRoute> },
        { path: "manageScholarships", element: <SuperAdminRoute>{susp(<ManageScholarships />)}</SuperAdminRoute> },
        { path: "manageScholarships/:id", element: <SuperAdminRoute>{susp(<EditScholarship />)}</SuperAdminRoute> },
        { path: "manageAppliedApplication", element: susp(<ManageAppliedApplication />) },
        { path: "allAppliedScholarships/:id", element: susp(<ApplicationCard />) },
        { path: "manageUsers", element: susp(<ManageUsers />) },
        { path: "institutionApprovals", element: <SuperAdminRoute>{susp(<InstitutionApprovals />)}</SuperAdminRoute> },
        { path: "manageReviews", element: susp(<ManageReview />) },
        { path: "manageReviews/history", element: susp(<ReviewHistory />) },
      ],
    },
    {
      path: "institutionDashboard",
      element: <InstitutionRoute><AdminDashboard /></InstitutionRoute>,
      children: [
        { path: "myProfile", element: susp(<MyProfile />) },
        { path: "students", element: susp(<MyProfile />) },
        { path: "addScholarships", element: susp(<AddScholarship />) },
        { path: "manageScholarships", element: susp(<ManageScholarships />) },
        { path: "manageScholarships/:id", element: susp(<EditScholarship />) },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default router;
