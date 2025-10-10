import { CalendarIcon, Clock, Info, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";
import { GatePass } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface StudentPassItemProps {
  gatePass: GatePass;
  onView: () => void;
}

const StudentPassItem = ({ gatePass, onView }: StudentPassItemProps) => {
  const { toast } = useToast();

  const verifyMutation = useMutation({
    mutationFn: () =>
      apiRequest("PUT", `/api/gate-passes/${gatePass.id}/verify`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gate-passes"] });
      toast({
        title: "Gate pass verified",
        description: "Student pass has been verified successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error.message || "Please try again",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const handleVerify = (e: React.MouseEvent) => {
    e.stopPropagation();
    verifyMutation.mutate();
  };

  return (
    <div
      className="block hover:bg-slate-50 px-4 py-4 border-b border-slate-200 cursor-pointer"
      onClick={onView}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-sm font-medium text-primary-600 truncate">
            #{gatePass.id}
          </p>
          <div className="ml-2 flex-shrink-0 flex">
            <Badge
              variant="outline"
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                gatePass.status
              )}`}
            >
              {gatePass.status.charAt(0).toUpperCase() + gatePass.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div>
          <Button
            size="sm"
            variant="default"
            className="rounded-full text-xs"
            onClick={handleVerify}
            disabled={
              verifyMutation.isPending ||
              gatePass.status !== "approved" ||
              gatePass.verified
            }
          >
            {gatePass.verified ? "Verified" : "Verify"}
          </Button>
        </div>
      </div>
      <div className="mt-2 sm:flex sm:justify-between">
        <div className="sm:flex sm:flex-col">
          <p className="flex items-center text-sm text-slate-500">
            <User className="mr-1.5 h-4 w-4 text-slate-400" />
            {gatePass.student.name} ({gatePass.student.department})
          </p>
          <p className="mt-1 flex items-center text-sm text-slate-500">
            <Info className="mr-1.5 h-4 w-4 text-slate-400" />
            {gatePass.reason}
          </p>
        </div>
        <div className="mt-2 flex flex-col items-end text-sm text-slate-500 sm:mt-0">
          <p className="flex items-center">
            <CalendarIcon className="mr-1.5 h-4 w-4 text-slate-400" />
            {formatDate(gatePass.date)}
          </p>
          <p className="mt-1 flex items-center">
            <Clock className="mr-1.5 h-4 w-4 text-slate-400" />
            {formatTime(gatePass.fromTime)} - {formatTime(gatePass.toTime)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentPassItem;
