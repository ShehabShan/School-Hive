import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import useUser from "../Hooks/useUser";
import useRole from "../Hooks/useRole";

// import useAdmin from "../Hooks/useAdmin";

const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [isUser, isUserLoading] = useUser();
  const { isPending, loading: roleLoading } = useRole();
  const location = useLocation();
  // console.log(isAdmin);

  if (loading || isUserLoading || roleLoading) {
    return <progress className="progress w-56"></progress>;
  }

  if (isPending) {
    return <Navigate to="/pendingApproval" replace />;
  }

  if (user && isUser) {
    return children;
  }
  return <Navigate to="/signIn" state={{ from: location }} replace></Navigate>;
};

export default UserRoute;
