import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";

const SuperAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isSuperAdmin, isPending, loading: roleLoading } = useRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <progress className="progress w-56"></progress>;
  }

  if (isPending) {
    return <Navigate to="/pendingApproval" replace />;
  }

  if (user && isSuperAdmin) {
    return children;
  }
  return <Navigate to="/signIn" state={{ from: location }} replace></Navigate>;
};

export default SuperAdminRoute;