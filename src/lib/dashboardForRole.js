export const dashboardForRole = (me) => {
  const role = me?.role;
  const status = me?.status;
  if (role === "superadmin" || role === "admin") return "/adminDashboard/adminProfile";
  if (role === "modaretor") return "/modaratorDashboard/myProfile";
  if (role === "institution") {
    if (status === "rejected") return "/rejectedApproval";
    if (status === "pending") return "/pendingApproval";
    return "/institutionDashboard/myProfile";
  }
  return null;
};