import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Home, User, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatTime, truncateText } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GatePassDetails from "@/components/student/gate-pass-details";
import { config } from "../lib/config";

const StaffDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // For demo purposes, let's use the advisor role by default
  // In a real app, this would be determined by the logged-in user's data
  const [currentUser, setCurrentUser] = useState({});
  const [staffRole, setStaffRole] = useState(""); // Role is derived from the user data
  const [userId, setUserId] = useState("");
  const [name, setName] = useState({});
  // Set the appropriate passes based on the staff role
  const [passes, setPasses] = useState([]);

  const [selectedPass, setSelectedPass] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null); // "approve" or "reject" or null

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("sessionToken");

      const req = await fetch(`${config.env.SERVER_URL}/api/staff/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await req.json();
      if (!data.id) {
        throw new Error("Server Error");
      }
      // const formattedStaffData = {
      //   name: `Prof. ${data.name}`,
      //   email: data.email,
      //   phone: data.phone,
      //   staffId: data.staff_code,
      //   department: data.department,
      //   designation: data.designation,
      // };
      setStaffRole(data.designation.toLowerCase());
      setUserId(data.id);
      setName({
        name: data.name,
        designation:
          data.designation === "class_advisor"
            ? "Class Advisor"
            : data.designation === "hod"
            ? "Head of Department"
            : data.designation === "principal"
            ? "Principal"
            : data.designation === "warden"
            ? "Warden"
            : "Staff",
        department: data.designation === "warden" ? "NIL" : data.department,
      });
      const gatePass = await fetch(
        `${config.env.SERVER_URL}/api/gatepass/pending/${data.designation}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const apiResponse = await gatePass.json();

      const mappedData = apiResponse.map((item) => ({
        id: item.id,
        userId: item.student_id,
        date: item.date, //item.date.split("T")[0], // Extract date part only
        fromTime: item.time.slice(0, 5), // 'HH:MM' format
        toTime: null, // Not available in source
        reason: item.reason,
        status: item.status.toLowerCase(),
        verified: item.security_verification === "Verified",
        createdAt: new Date(item.date), // Assuming createdAt same as date
        approvals: {
          advisor: item.class_advisor_approval.toLowerCase(),
          hod: item.hod_approval.toLowerCase(),
          principal: item.principal_approval.toLowerCase(),
          // warden: item.principal_approval === "Approved",
        },
        vehicleNo: null, // Not available in source
        student: {
          name: item.name,
          department: item.department,
        },
      }));

      setPasses(mappedData);
    };
    fetchUser();
  }, []);
  // Function to switch between different staff roles (for demo purposes only)
  const switchRole = (role) => {
    setCurrentUser(sampleStaffUsers[role]);

    // Update the passes based on the new role
    switch (role) {
      case "advisor":
        setPasses(sampleGatePassesForAdvisor);
        break;
      case "hod":
        setPasses(sampleGatePassesForHOD);
        break;
      case "principal":
        setPasses(sampleGatePassesForPrincipal);
        break;
      default:
        setPasses([]);
    }
  };

  const handleViewPass = (pass) => {
    setSelectedPass(pass);
    setDetailsOpen(true);
  };

  const filteredPasses = passes;
  // .filter((pass) => {
  //   // For class advisor, show passes that need advisor approval
  //   if (staffRole === "advisor") {
  //     return !pass.approvals.advisor;
  //   }
  //   // For HOD, show passes that have advisor approval but need HOD approval
  //   else if (staffRole === "hod") {
  //     return pass.approvals.advisor && !pass.approvals.hod;
  //   }
  //   // For principal, show passes that have HOD approval but need principal approval
  //   else if (staffRole === "principal") {
  //     return (
  //       pass.approvals.advisor &&
  //       pass.approvals.hod &&
  //       !pass.approvals.principal
  //     );
  //   }
  //   return false;
  // });

  const handleConfirmation = (type, pass) => {
    setSelectedPass(pass);
    setConfirmDialog(type);
  };

  const handleApprove = async () => {
    const token = localStorage.getItem("sessionToken");
    const gatePassAction = await fetch(
      `${config.env.SERVER_URL}/api/gatepass/${selectedPass.id}/approve`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: staffRole,
          status: "Approved",
        }),
      }
    );
    const apiResponse = await gatePassAction.json();

    if (gatePassAction.status === 200) {
      const updatedPasses = passes.filter(
        (pass) => pass.id !== selectedPass.id
      );

      setPasses(updatedPasses);

      toast({
        title: "Gate pass approved",
        description: `You have approved the gate pass for ${selectedPass.student.name}.`,
      });
    }

    setConfirmDialog(null);
  };

  const handleReject = async () => {
    const token = localStorage.getItem("sessionToken");
    const gatePassAction = await fetch(
      `${config.env.SERVER_URL}/api/gatepass/${selectedPass.id}/approve`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: staffRole,
          status: "Rejected",
        }),
      }
    );
    const apiResponse = await gatePassAction.json();

    if (gatePassAction.status === 200) {
      const updatedPasses = passes.filter(
        (pass) => pass.id !== selectedPass.id
      );

      setPasses(updatedPasses);

      toast({
        title: "Gate pass rejected",
        description: `You have rejected the gate pass for ${selectedPass.student.name}.`,
        variant: "destructive",
      });
    }

    setConfirmDialog(null);
  };

  const getRoleName = () => {
    switch (staffRole) {
      case "advisor":
        return "Class Advisor";
      case "hod":
        return "Head of Department";
      case "principal":
        return "Principal";
      default:
        return "Staff";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header with navigation and profile */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-primary">
              {getRoleName()} Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              {/* <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link> */}
              <Link href="/staff-profile">
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">{name.name}</div>
                    <div className="text-xs text-slate-500">
                      {name.designation}
                    </div>
                  </div>
                  <span className="h-8 w-8 bg-slate-300 rounded-full flex items-center justify-center">
                    {name.name ? name.name.charAt(0) : "S"}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-semibold text-slate-900">
              Gate Pass Approvals
            </h2>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900">
                {name.name}
              </div>
              <div className="text-xs text-slate-500">
                {name.designation}, {name.department}
              </div>
            </div>
          </div>

          {/* For demo purposes only - buttons to switch between roles */}
          {/* <div className="mb-6 flex flex-wrap gap-2 bg-slate-50 p-3 rounded-md border border-slate-200">
            <div className="w-full text-xs text-slate-500 mb-1">
              Demo controls:
            </div>
            <Button
              size="sm"
              variant={staffRole === "advisor" ? "default" : "outline"}
              onClick={() => switchRole("advisor")}
            >
              Login as Advisor
            </Button>
            <Button
              size="sm"
              variant={staffRole === "hod" ? "default" : "outline"}
              onClick={() => switchRole("hod")}
            >
              Login as HOD
            </Button>
            <Button
              size="sm"
              variant={staffRole === "principal" ? "default" : "outline"}
              onClick={() => switchRole("principal")}
            >
              Login as Principal
            </Button>
          </div> */}

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-36 w-full rounded-md" />
              ))}
            </div>
          ) : filteredPasses.length > 0 ? (
            <div className="space-y-4">
              {filteredPasses.map((pass) => (
                <div key={pass.id} className="bg-white rounded-lg shadow">
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-primary">
                          {pass.student.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {pass.student.department}
                        </p>
                        <div className="flex items-center mt-2 gap-2 flex-wrap">
                          {/* <Badge variant="outline">
                            {formatDate(pass.date)}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            {formatTime(pass.fromTime)} -{" "}
                            {formatTime(pass.toTime)}
                          </span> */}
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPass(pass)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleConfirmation("approve", pass)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleConfirmation("reject", pass)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Reason:</span>{" "}
                        {truncateText(pass.reason, 100)}
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-500">
                        Request submitted on {formatDate(pass.createdAt)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-600">
                          Approval Status:
                        </span>
                        <span
                          className={`text-xs ${
                            pass.approvals.advisor === "approved"
                              ? "text-green-600"
                              : pass.approvals.advisor === "rejected"
                              ? "text-red-600"
                              : "text-slate-400"
                          }`}
                        >
                          Advisor{" "}
                          {pass.approvals.advisor === "approved"
                            ? "✓"
                            : pass.approvals.advisor === "rejected"
                            ? "X"
                            : "○"}
                        </span>
                        <span className="text-xs text-slate-300">→</span>
                        <span
                          className={`text-xs ${
                            pass.approvals.hod === "approved"
                              ? "text-green-600"
                              : pass.approvals.hod === "rejected"
                              ? "text-red-600"
                              : "text-slate-400"
                          }`}
                        >
                          HOD{" "}
                          {pass.approvals.hod === "approved"
                            ? "✓"
                            : pass.approvals.hod === "rejected"
                            ? "X"
                            : "○"}
                        </span>
                        <span className="text-xs text-slate-300">→</span>
                        <span
                          className={`text-xs ${
                            pass.approvals.principal === "approved"
                              ? "text-green-600"
                              : pass.approvals.principal === "rejected"
                              ? "text-red-600"
                              : "text-slate-400"
                          }`}
                        >
                          Principal{" "}
                          {pass.approvals.principal === "approved"
                            ? "✓"
                            : pass.approvals.principal === "rejected"
                            ? "X"
                            : "○"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
              <p className="text-slate-600">
                No gate passes pending your approval.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Approval confirmation dialog */}
      <Dialog
        open={confirmDialog === "approve"}
        onOpenChange={() => setConfirmDialog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Gate Pass</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve the gate pass for{" "}
              {selectedPass?.student.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDialog(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
            >
              Approve Pass
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection confirmation dialog */}
      <Dialog
        open={confirmDialog === "reject"}
        onOpenChange={() => setConfirmDialog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Gate Pass</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject the gate pass for{" "}
              {selectedPass?.student.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDialog(null)}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleReject}>
              Reject Pass
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gate pass details */}
      <GatePassDetails
        gatePass={selectedPass}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
};

export default StaffDashboard;
