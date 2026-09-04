import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import RouteFallback from "../Component/ui/RouteFallback";

const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isUser, isPending, loading: roleLoading } = useRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <RouteFallback />;
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
