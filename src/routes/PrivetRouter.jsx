import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import RouteFallback from "../Component/ui/RouteFallback";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isPending, loading: roleLoading } = useRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <RouteFallback />;
  }

  if (user && isPending) {
    return <Navigate to="/pendingApproval" replace />;
  }

  if (user) {
    return children;
  }
  return <Navigate to="/signIn" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;
