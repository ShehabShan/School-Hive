import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
// import useAdmin from "../Hooks/useAdmin";
import useModaretor from "../Hooks/useModaretor";
import useRole from "../Hooks/useRole";
import RouteFallback from "../Component/ui/RouteFallback";

const ModaretorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  // const [isAdmin, isAdminLoading] = useAdmin();
  const [isModaretor, isModaretorLoading] = useModaretor();
  const { isPending, loading: roleLoading } = useRole();
  const location = useLocation();
  // console.log(isAdmin);

  if (loading || isModaretorLoading || roleLoading) {
    return <RouteFallback />;
  }

  if (isPending) {
    return <Navigate to="/pendingApproval" replace />;
  }

  if (user && isModaretor) {
    return children;
  }
  return <Navigate to="/signIn" state={{ from: location }} replace></Navigate>;
};

export default ModaretorRoute;
