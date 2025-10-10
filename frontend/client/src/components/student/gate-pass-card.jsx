import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";

const GatePassCard = ({ gatePass, onClick }) => {
  const getStatusColor = (status) => {
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

  const getVerifiedStatus = () => {
    if (gatePass.status !== "approved") return null;

    return gatePass.verified ? (
      <Badge
        variant="outline"
        className="bg-green-50 border-green-200 text-green-700"
      >
        Verified
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="bg-blue-50 border-blue-200 text-blue-700"
      >
        Not Verified
      </Badge>
    );
  };

  return (
    <div
      className="bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-medium text-primary">
              Gate Pass for {formatDate(gatePass.date)}
            </h3>

            <div className="flex items-center text-slate-600 gap-1 mt-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{formatTime(gatePass.fromTime)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(gatePass.status)}>
              {gatePass.status.charAt(0).toUpperCase() +
                gatePass.status.slice(1)}
            </Badge>
            {getVerifiedStatus()}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Reason:</span> {gatePass.reason}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <h4 className="text-sm font-medium text-slate-700 mb-2">
            Approval Progress:
          </h4>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{
                width: `${calculateApprovalPercentage(gatePass.approvals)}%`,
              }}
            ></div>
          </div>

          <div className="flex justify-between mt-2">
            <div className="text-center">
              <span
                className={`text-xs font-medium ${
                  gatePass.approvals.advisor === "approved"
                    ? "text-green-600"
                    : gatePass.approvals.advisor === "rejected"
                    ? "text-red-600"
                    : "text-slate-400"
                }`}
              >
                Advisor{" "}
                {gatePass.approvals.advisor === "approved"
                  ? "✓"
                  : gatePass.approvals.advisor === "rejected"
                  ? "X"
                  : "○"}
              </span>
            </div>
            <div className="text-center">
              <span
                className={`text-xs font-medium ${
                  gatePass.approvals.hod === "approved"
                    ? "text-green-600"
                    : gatePass.approvals.hod === "rejected"
                    ? "text-red-600"
                    : "text-slate-400"
                }`}
              >
                HOD{" "}
                {gatePass.approvals.hod === "approved"
                  ? "✓"
                  : gatePass.approvals.hod === "rejected"
                  ? "X"
                  : "○"}
              </span>
            </div>
            <div className="text-center">
              <span
                className={`text-xs font-medium ${
                  gatePass.approvals.principal === "approved"
                    ? "text-green-600"
                    : gatePass.approvals.principal === "rejected"
                    ? "text-red-600"
                    : "text-slate-400"
                }`}
              >
                Principal{" "}
                {gatePass.approvals.principal === "approved"
                  ? "✓"
                  : gatePass.approvals.principal === "rejected"
                  ? "X"
                  : "○"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate approval percentage
function calculateApprovalPercentage(approvals) {
  const steps = 3; // advisor, hod, principal
  let completed = 0;

  if (approvals.advisor === "approved") completed++;
  if (approvals.hod === "approved") completed++;
  if (approvals.principal === "approved") completed++;

  return (completed / steps) * 100;
}

export default GatePassCard;
