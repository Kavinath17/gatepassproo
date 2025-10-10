import { Check, Eye, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const VisitorPassItem = ({ visitorPass, onCall, onView }) => {
  const { toast } = useToast();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

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

  const handleVerify = (e) => {
    e.stopPropagation();
    // Simulate API call for verification
    toast({
      title: "Visitor pass verified",
      description: "Visitor pass has been verified successfully.",
    });
  };

  const handleReject = () => {
    // Simulate API call for rejection
    toast({
      title: "Visitor pass rejected",
      description: "Visitor pass has been rejected.",
    });
    setRejectDialogOpen(false);
  };

  const openRejectDialog = (e) => {
    e.stopPropagation();
    setRejectDialogOpen(true);
  };
  const handleExit = async (id) => {
    // console.log("Exit button clicked for ID:", id);
    const req = await fetch(
      `${config.env.SERVER_URL}/api/visitors/exit/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      }
    );
    const res = await req.json();
    if (req.status === 200) {
      // Simulate API call for verification
      toast({
        title: "Visitor pass Exited",
        description: "Visiotr pass has been exited successfully.",
      });
    } else {
      toast({
        title: "Visitor Pass Error",
        description: "Error while exiting the visitor pass.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div
        className="hover:bg-slate-50 cursor-pointer border-b border-slate-200"
        onClick={onView}
      >
        <div className="px-4 py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-base font-medium text-primary truncate">
                {visitorPass.visitorName}
              </p>
              <div className="flex flex-wrap gap-2 mt-1 items-center">
                <Badge variant="outline">{formatDate(visitorPass.date)}</Badge>
                <span className="text-xs text-slate-500">
                  Contact: {visitorPass.phone}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Expected Exit Time: {visitorPass.expectedExitTime}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
              <Badge className={getStatusColor(visitorPass.status)}>
                {visitorPass.status.charAt(0).toUpperCase() +
                  visitorPass.status.slice(1)}
              </Badge>
              <div className="flex items-center gap-2">
                {/* <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCall();
                  }}
                >
                  <Phone className="h-4 w-4" />
                  <span className="sr-only">Call</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView();
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button> */}
                {/* {visitorPass.status !== "Exited" && (
                  <Button
                    // variant="ghost"

                    className="h-8 w-8 py-4 px-8 z-20"
                    onClick={() => {
                      handleExit(visitorPass.id);
                    }}
                  >
                    
                    Exit
                  </Button>
                )} */}
                {/* {visitorPass.status !== "rejected" && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={openRejectDialog}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Reject</span>
                  </Button>
                )} */}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-slate-600 line-clamp-1">
              Purpose: {visitorPass.purpose}
            </p>
            <p className="text-sm text-slate-600 line-clamp-1 mt-1">
              Concerned Person: {visitorPass.concernPerson}
            </p>
            {visitorPass.vehicleNo && (
              <p className="text-sm text-slate-600 mt-1">
                Vehicle: {visitorPass.vehicleNo}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reject confirmation dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Visitor Pass</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject the visitor pass for{" "}
              {visitorPass.visitorName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleReject}>
              Reject Pass
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisitorPassItem;
