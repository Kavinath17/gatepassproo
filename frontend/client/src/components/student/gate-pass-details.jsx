import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";
import {
  Clock,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import GatePassQR from "./gate-pass-qr";

const GatePassDetails = ({ gatePass, open, onClose }) => {
  if (!gatePass) return null;

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-slate-600" />;
    }
  };

  const getApprovalStatus = (isApproved) => {
    return isApproved === "approved" ? (
      <div className="flex items-center">
        <CheckCircle2 className="h-4 w-4 text-green-600 mr-1.5" />
        <span className="text-green-600 font-medium">Approved</span>
      </div>
    ) : isApproved === "rejected" ? (
      <div className="flex items-center">
        <XCircle className="h-4 w-4 text-red-600 mr-1.5" />
        <span className="text-red-600 font-medium">Rejected</span>
      </div>
    ) : (
      <div className="flex items-center">
        <AlertCircle className="h-4 w-4 text-slate-400 mr-1.5" />
        <span className="text-slate-400">Pending</span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gate Pass Details</DialogTitle>
          <DialogDescription>
            View the details of your gate pass
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium">
                {formatDate(gatePass.date)}
              </span>
            </div>
            <Badge className={getStatusColor(gatePass.status)}>
              {gatePass.status.charAt(0).toUpperCase() +
                gatePass.status.slice(1)}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-sm">
              From Time: {formatTime(gatePass.fromTime)}
            </span>
          </div>
          {gatePass.toTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span className="text-sm">
                Exited Time :{formatTime(gatePass.toTime)}
              </span>
            </div>
          )}

          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-slate-500 mt-0.5" />
            <span className="text-sm">{gatePass.reason}</span>
          </div>

          {gatePass.vehicleNo && (
            <div className="flex items-center gap-2">
              <span className="text-sm">
                <span className="font-medium">Vehicle:</span>{" "}
                {gatePass.vehicleNo}
              </span>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-medium text-slate-900 mb-3">
              Approval Status
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Class Advisor</span>
                {getApprovalStatus(gatePass.approvals.advisor)}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Head of Department</span>
                {getApprovalStatus(gatePass.approvals.hod)}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Principal</span>
                {getApprovalStatus(gatePass.approvals.principal)}
              </div>

              {gatePass.student.residence == "hostel" && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Warden</span>
                  {getApprovalStatus(gatePass.approvals.warden)}
                </div>
              )}
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100 flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Pass created on {formatDate(gatePass.createdAt)}
              </span>
            </div>
          </div>

          {gatePass.status === "approved" && (
            <div
              className={`p-3 rounded-md ${
                gatePass.verified ? "bg-green-50" : "bg-blue-50"
              }`}
            >
              <div className="flex items-start gap-2">
                {gatePass.verified ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Verified by Security
                      </p>
                      <p className="text-xs text-green-700">
                        This gate pass has been verified and can be used to exit
                        the campus.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Awaiting Security Verification
                      </p>
                      <p className="text-xs text-blue-700">
                        This gate pass has been approved but needs verification
                        at the security gate.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {gatePass.status === "rejected" && (
            <div className="p-3 rounded-md bg-red-50">
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Gate Pass Rejected
                  </p>
                  <p className="text-xs text-red-700">
                    This gate pass has been rejected. Please create a new
                    request if needed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* QR Code Display for Approved Passes */}
          {/* {gatePass.status === "approved" && (
            <GatePassQR gatePass={gatePass} />
          )} */}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GatePassDetails;
