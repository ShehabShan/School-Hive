import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import useUser from "../Hooks/useUser";

// import useAdmin from "../Hooks/useAdmin";

const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [isUser, isUserLoading] = useUser();
  const location = useLocation();
  // console.log(isAdmin);

  if (loading || isUserLoading) {
    return <progress className="progress w-56"></progress>;
  }

  if (user && isUser) {
    return children;
  }
  return <Navigate to="/signIn" state={{ from: location }} replace></Navigate>;
};

export default UserRoute;
