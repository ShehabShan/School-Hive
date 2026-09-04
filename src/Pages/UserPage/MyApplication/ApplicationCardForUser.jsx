import { User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import PageHeader from "../../../Component/ui/PageHeader";
import StatusBadge from "../../../Component/ui/StatusBadge";
import Spinner from "../../../Component/ui/Spinner";
import ApplicationDetails from "./ApplicationDetails";

const ApplicationCardForUser = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: singleApply = [], isLoading } = useQuery({
    queryKey: ["userApply", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/singleApply/${id}`);
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8 text-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        icon={User}
        title="Application Details"
        subtitle={singleApply?.email}
        actions={<StatusBadge status={singleApply?.applicationStatus} />}
      />
      <ApplicationDetails data={singleApply} />
    </div>
  );
};

export default ApplicationCardForUser;
