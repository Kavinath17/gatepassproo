import { CalendarIcon, Phone, Info, User, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { VisitorPass } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VisitorPassItemProps {
  visitorPass: VisitorPass;
  onCall: () => void;
  onView: () => void;
}

const VisitorPassItem = ({ visitorPass, onCall, onView }: VisitorPassItemProps) => {
  const { toast } = useToast();

  const verifyMutation = useMutation({
    mutationFn: () =>
      apiRequest("PUT", `/api/visitor-passes/${visitorPass.id}/verify`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/visitor-passes"] });
      toast({
        title: "Visitor pass verified",
        description: "Visitor pass has been verified successfully.",
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

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCall();
  };

  return (
    <div
      className="block hover:bg-slate-50 px-4 py-4 border-b border-slate-200 cursor-pointer"
      onClick={onView}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-sm font-medium text-primary-600 truncate">
            #{visitorPass.id}
          </p>
          <div className="ml-2 flex-shrink-0 flex">
            <Badge
              variant="outline"
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                visitorPass.status
              )}`}
            >
              {visitorPass.status.charAt(0).toUpperCase() + visitorPass.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="default"
            className="rounded-full text-xs"
            onClick={handleVerify}
            disabled={
              verifyMutation.isPending ||
              visitorPass.status !== "approved" ||
              visitorPass.verified
            }
          >
            {visitorPass.verified ? "Verified" : "Verify"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full text-xs"
            onClick={handleCall}
          >
            <Phone className="h-3 w-3 mr-1" /> Call
          </Button>
        </div>
      </div>
      <div className="mt-2 sm:flex sm:justify-between">
        <div className="sm:flex sm:flex-col">
          <p className="flex items-center text-sm text-slate-500">
            <User className="mr-1.5 h-4 w-4 text-slate-400" />
            {visitorPass.visitorName}
          </p>
          <p className="mt-1 flex items-center text-sm text-slate-500">
            <Info className="mr-1.5 h-4 w-4 text-slate-400" />
            {visitorPass.purpose}
          </p>
          <p className="mt-1 flex items-center text-sm text-slate-500">
            <User className="mr-1.5 h-4 w-4 text-slate-400" />
            Meeting: {visitorPass.concernPerson}
          </p>
        </div>
        <div className="mt-2 flex flex-col items-end text-sm text-slate-500 sm:mt-0">
          <p className="flex items-center">
            <CalendarIcon className="mr-1.5 h-4 w-4 text-slate-400" />
            {formatDate(visitorPass.date)}
          </p>
          <p className="flex items-center mt-1">
            <Phone className="mr-1.5 h-4 w-4 text-slate-400" />
            {visitorPass.phone}
          </p>
          {visitorPass.vehicleNo && (
            <p className="flex items-center mt-1">
              <Car className="mr-1.5 h-4 w-4 text-slate-400" />
              {visitorPass.vehicleNo}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorPassItem;
