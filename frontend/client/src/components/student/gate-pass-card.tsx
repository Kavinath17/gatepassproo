import { CalendarIcon, Clock, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatTime } from "@/lib/utils";
import { GatePass } from "@shared/schema";

interface GatePassCardProps {
  gatePass: GatePass;
  onClick: () => void;
}

const GatePassCard = ({ gatePass, onClick }: GatePassCardProps) => {
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

  const getProgressPercentage = () => {
    const approvalSteps = ["advisor", "hod", "principal", "security"];
    const lastApprovedIndex = approvalSteps.findIndex(
      (step) => !gatePass.approvals[step]?.approved
    );
    
    if (lastApprovedIndex === -1) return 100;
    if (lastApprovedIndex === 0) return 0;
    
    return (lastApprovedIndex / approvalSteps.length) * 100;
  };

  const getProgressColor = () => {
    if (gatePass.status === "rejected") return "bg-red-500";
    if (gatePass.status === "approved") return "bg-green-500";
    return "bg-yellow-500";
  };

  const getApprovalProgress = () => {
    const approvalSteps = ["advisor", "hod", "principal", "security"];
    const approvedCount = Object.values(gatePass.approvals).filter(
      (approval) => approval?.approved
    ).length;

    if (gatePass.status === "rejected") {
      const rejectedBy = Object.entries(gatePass.approvals).find(
        ([, value]) => value?.rejected
      );
      return `Rejected by ${rejectedBy?.[0] || ""}`;
    }

    return `${approvedCount}/${approvalSteps.length}`;
  };

  return (
    <Card 
      className="hover:bg-slate-50 cursor-pointer border-slate-200" 
      onClick={onClick}
    >
      <CardContent className="p-4">
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
          <div className="ml-2 flex-shrink-0 flex items-center text-sm text-slate-500">
            <Clock className="mr-1.5 h-4 w-4" />
            <p>{formatTime(gatePass.fromTime)} - {formatTime(gatePass.toTime)}</p>
          </div>
        </div>
        <div className="mt-2 sm:flex sm:justify-between">
          <div className="sm:flex">
            <p className="flex items-center text-sm text-slate-500">
              <Info className="mr-1.5 h-4 w-4 text-slate-400" />
              {gatePass.reason}
            </p>
          </div>
          <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
            <CalendarIcon className="mr-1.5 h-4 w-4 text-slate-400" />
            <p>{formatDate(gatePass.date)}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-slate-500">Approval Progress</span>
            <span className={`font-medium ${
              gatePass.status === "rejected" ? "text-red-700" : "text-slate-700"
            }`}>
              {getApprovalProgress()}
            </span>
          </div>
          <Progress 
            value={getProgressPercentage()} 
            className="h-2 bg-slate-200" 
            indicatorClassName={getProgressColor()} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GatePassCard;
