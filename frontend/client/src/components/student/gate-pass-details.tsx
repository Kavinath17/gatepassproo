import { CheckCircle, Clock, CalendarIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";
import { GatePass } from "@shared/schema";

interface GatePassDetailsProps {
  gatePass: GatePass | null;
  open: boolean;
  onClose: () => void;
}

const GatePassDetails = ({ gatePass, open, onClose }: GatePassDetailsProps) => {
  if (!gatePass) return null;

  const approvalSteps = [
    { key: "advisor", label: "Class Advisor" },
    { key: "hod", label: "Head of Department" },
    { key: "principal", label: "Principal" },
    { key: "security", label: "Gate Security" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium">
              Gate Pass #{gatePass.id}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </h4>
              <p className="mt-1 text-sm text-slate-900">
                {formatDate(gatePass.date)}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Time
              </h4>
              <p className="mt-1 text-sm text-slate-900">
                {formatTime(gatePass.fromTime)} - {formatTime(gatePass.toTime)}
              </p>
            </div>
            <div className="col-span-2">
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Reason
              </h4>
              <p className="mt-1 text-sm text-slate-900">{gatePass.reason}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-medium text-slate-700 mb-4">
              Approval Status
            </h4>

            <div className="space-y-4">
              {approvalSteps.map((step) => {
                const approval = gatePass.approvals[step.key];
                let status = "pending";
                if (approval?.approved) status = "approved";
                if (approval?.rejected) status = "rejected";

                return (
                  <div className="flex items-center" key={step.key}>
                    <div className="flex-shrink-0">
                      <div
                        className={`flex items-center justify-center h-8 w-8 rounded-full ${
                          status === "approved"
                            ? "bg-green-100"
                            : status === "rejected"
                            ? "bg-red-100"
                            : "bg-slate-100"
                        }`}
                      >
                        {status === "approved" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : status === "rejected" ? (
                          <X className="h-5 w-5 text-red-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h5 className="text-sm font-medium text-slate-900">
                          {step.label}
                        </h5>
                        {approval?.timestamp && (
                          <span className="text-xs text-slate-500">
                            {formatDate(approval.timestamp)}
                          </span>
                        )}
                      </div>
                      {approval?.approverName && (
                        <p className="text-xs text-slate-500">
                          {approval.approverName}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GatePassDetails;
