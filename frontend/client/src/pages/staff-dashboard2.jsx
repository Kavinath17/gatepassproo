import { useState } from "react";
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

// Sample gate passes pending approval for different staff roles
const sampleGatePassesForAdvisor = [
  {
    id: 201,
    userId: 301,
    date: "2025-04-05",
    fromTime: "09:00",
    toTime: "17:00",
    reason: "Medical appointment at City Hospital for regular checkup",
    status: "pending",
    verified: false,
    createdAt: new Date("2025-04-03"),
    approvals: {
      advisor: false,
      hod: false,
      principal: false,
    },
    vehicleNo: null,
    student: {
      name: "Sarah Johnson",
      department: "Computer Science",
    },
  },
  {
    id: 202,
    userId: 302,
    date: "2025-04-06",
    fromTime: "13:00",
    toTime: "18:00",
    reason: "Family function at home, need to leave campus",
    status: "pending",
    verified: false,
    createdAt: new Date("2025-04-04"),
    approvals: {
      advisor: false,
      hod: false,
      principal: false,
    },
    vehicleNo: null,
    student: {
      name: "James Wilson",
      department: "Computer Science",
    },
  },
  {
    id: 203,
    userId: 303,
    date: "2025-04-07",
    fromTime: "10:00",
    toTime: "16:00",
    reason: "Need to attend a workshop on AI at TechHub",
    status: "pending",
    verified: false,
    createdAt: new Date("2025-04-04"),
    approvals: {
      advisor: false,
      hod: false,
      principal: false,
    },
    vehicleNo: null,
    student: {
      name: "Priya Patel",
      department: "Computer Science",
      residence: "hostel",
    },
  },
];

const sampleGatePassesForHOD = [
  {
    id: 204,
    userId: 304,
    date: "2025-04-05",
    fromTime: "14:00",
    toTime: "19:00",
    reason: "Participation in inter-college programming competition",
    status: "pending",
    verified: false,
    createdAt: new Date("2025-04-03"),
    approvals: {
      advisor: true,
      hod: false,
      principal: false,
    },
    vehicleNo: null,
    student: {
      name: "Michael Chen",
      department: "Information Technology",
    },
  },
  {
    id: 205,
    userId: 305,
    date: "2025-04-06",
    fromTime: "09:00",
    toTime: "17:00",
    reason: "Need to collect important documents from home",
    status: "pending",
    verified: false,
    createdAt: new Date("2025-04-04"),
    approvals: {
      advisor: true,
      hod: false,
      principal: false,
    },
    vehicleNo: null,
    student: {
      name: "Emily Davis",
      department: "Information Technology",
    },
  },
  {
    id: 206,
    userId: 306,
    date: "2025-04-07",
    fromTime: "12:00",
    toTime: "18:00",
    reason: "Attending a relative's wedding ceremony",
    status: "pending",
    verified: false,
    createdAt: new Date("2025-04-04"),
    approvals: {
      advisor: true,
      hod: false,
      principal: false,
    },
    vehicleNo: null,
    student: {
      name: "Robert Brown",
      department: "Information Technology",
    },
  },
];

const sampleGatePassesForPrincipal = [
  {
    id: 207,
    userId: 307,
    date: "2025-04-05",
    fromTime: "09:00",
    toTime: "17:00",
    reason: "Family emergency - need to visit home",
    status: "pending",
    verified: false,
    createdAt: new Date("2025-04-03"),
    approvals: {
      advisor: true,
      hod: true,
      principal: false,
    },
    vehicleNo: null,
    student: {
      name: "Emma Rodriguez",
      department: "Electrical Engineering",
    },
  },
  {
    id: 208,
    userId: 308,
    date: "2025-04-06",
    fromTime: "08:00",
    toTime: "20:00",
    reason: "Need to go to hospital for a scheduled surgery",
    status: "pending",
    verified: false,
    createdAt: new Date("2025-04-04"),
    approvals: {
      advisor: true,
      hod: true,
      principal: false,
    },
    vehicleNo: null,
    student: {
      name: "David Thompson",
      department: "Mechanical Engineering",
    },
  },
  {
    id: 209,
    userId: 309,
    date: "2025-04-07",
    fromTime: "13:00",
    toTime: "18:00",
    reason: "Attending an important family function",
    status: "pending",
    verified: false,
    createdAt: new Date("2025-04-04"),
    approvals: {
      advisor: true,
      hod: true,
      principal: false,
    },
    vehicleNo: null,
    student: {
      name: "Jennifer Martinez",
      department: "Civil Engineering",
    },
  },
];

// Sample user data - this could be retrieved from authentication context in a real application
// Role is determined by designation
const sampleStaffUsers = {
  advisor: {
    id: 101,
    name: "Dr. Sarah Parker",
    email: "s.parker@college.edu",
    department: "Computer Science",
    role: "advisor",
    designation: "Assistant Professor",
  },
  hod: {
    id: 102,
    name: "Prof. James Wilson",
    email: "j.wilson@college.edu",
    department: "Information Technology",
    role: "hod",
    designation: "Head of Department",
  },
  principal: {
    id: 103,
    name: "Dr. Emily White",
    email: "e.white@college.edu",
    department: "College Administration",
    role: "principal",
    designation: "Principal",
  },
};

const StaffDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // For demo purposes, let's use the advisor role by default
  // In a real app, this would be determined by the logged-in user's data
  const [currentUser, setCurrentUser] = useState(sampleStaffUsers.advisor);
  const staffRole = currentUser.role; // Role is derived from the user data

  // Set the appropriate passes based on the staff role
  const [passes, setPasses] = useState(() => {
    switch (staffRole) {
      case "advisor":
        return sampleGatePassesForAdvisor;
      case "hod":
        return sampleGatePassesForHOD;
      case "principal":
        return sampleGatePassesForPrincipal;
      default:
        return [];
    }
  });

  const [selectedPass, setSelectedPass] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null); // "approve" or "reject" or null

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

  const filteredPasses = passes.filter((pass) => {
    // For class advisor, show passes that need advisor approval
    if (staffRole === "advisor") {
      return !pass.approvals.advisor;
    }
    // For HOD, show passes that have advisor approval but need HOD approval
    else if (staffRole === "hod") {
      return pass.approvals.advisor && !pass.approvals.hod;
    }
    // For principal, show passes that have HOD approval but need principal approval
    else if (staffRole === "principal") {
      return (
        pass.approvals.advisor &&
        pass.approvals.hod &&
        !pass.approvals.principal
      );
    }
    return false;
  });

  const handleConfirmation = (type, pass) => {
    setSelectedPass(pass);
    setConfirmDialog(type);
  };

  const handleApprove = () => {
    // Simulate API call to approve pass
    if (selectedPass) {
      const updatedPasses = passes.map((pass) => {
        if (pass.id === selectedPass.id) {
          const updatedPass = { ...pass };

          if (staffRole === "advisor") {
            updatedPass.approvals.advisor = true;
          } else if (staffRole === "hod") {
            updatedPass.approvals.hod = true;
          } else if (staffRole === "principal") {
            updatedPass.approvals.principal = true;
            updatedPass.status = "approved"; // Final approval
          }

          return updatedPass;
        }
        return pass;
      });

      setPasses(updatedPasses);

      toast({
        title: "Gate pass approved",
        description: `You have approved the gate pass for ${selectedPass.student.name}.`,
      });
    }

    setConfirmDialog(null);
  };

  const handleReject = () => {
    // Simulate API call to reject pass
    if (selectedPass) {
      const updatedPasses = passes.map((pass) => {
        if (pass.id === selectedPass.id) {
          return {
            ...pass,
            status: "rejected",
          };
        }
        return pass;
      });

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
                    <div className="text-sm font-medium">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {currentUser.designation}
                    </div>
                  </div>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback>
                      {currentUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
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
                {currentUser.name}
              </div>
              <div className="text-xs text-slate-500">
                {currentUser.designation}, {currentUser.department}
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
                          <Badge variant="outline">
                            {formatDate(pass.date)}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            {formatTime(pass.fromTime)} -{" "}
                            {formatTime(pass.toTime)}
                          </span>
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
                            pass.approvals.advisor
                              ? "text-green-600"
                              : "text-slate-400"
                          }`}
                        >
                          Advisor {pass.approvals.advisor ? "✓" : "○"}
                        </span>
                        <span className="text-xs text-slate-300">→</span>
                        <span
                          className={`text-xs ${
                            pass.approvals.hod
                              ? "text-green-600"
                              : "text-slate-400"
                          }`}
                        >
                          HOD {pass.approvals.hod ? "✓" : "○"}
                        </span>
                        <span className="text-xs text-slate-300">→</span>
                        <span
                          className={`text-xs ${
                            pass.approvals.principal
                              ? "text-green-600"
                              : "text-slate-400"
                          }`}
                        >
                          Principal {pass.approvals.principal ? "✓" : "○"}
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
