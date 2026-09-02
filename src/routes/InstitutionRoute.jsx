import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import RouteFallback from "../Component/ui/RouteFallback";

const InstitutionRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isInstitution, isApprovedInstitution, isPending, isRejected, loading: roleLoading } = useRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <RouteFallback />;
  }

  if (user && isApprovedInstitution) {
    return children;
  }
  if (user && isInstitution && isPending) {
    return <Navigate to="/pendingApproval" replace />;
  }
  if (user && isInstitution && isRejected) {
    return <Navigate to="/rejectedApproval" replace />;
  }
  return <Navigate to="/signIn" state={{ from: location }} replace></Navigate>;
};

export default InstitutionRoute;