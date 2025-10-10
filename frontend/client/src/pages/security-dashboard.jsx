import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Home, Shield, QrCode, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import StudentPassItem from "@/components/security/student-pass-item";
import VisitorPassItem from "@/components/security/visitor-pass-item";
import StudentPassForm from "@/components/security/student-pass-form";
import VisitorPassForm from "../components/security/visitor-pass-form";
import QRCodeScanner from "@/components/security/qr-code-scanner";
import VisitorPassQR from "@/components/security/visitor-pass-qr";
import GatePassDetails from "@/components/student/gate-pass-details";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { config } from "../lib/config";
const sampleVisitorPasses = [
  {
    id: 201,
    visitorName: "Robert Brown",
    purpose: "Guest lecture",
    date: "2025-03-31",
    concernPerson: "Dr. Williams",
    concernPersonPhone: "9876543210",
    phone: "1234567890",
    status: "approved",
    verified: false,
    vehicleNo: "ABC123",
    createdAt: new Date("2025-03-27"),
  },
  {
    id: 202,
    visitorName: "Sarah Miller",
    purpose: "Parent meeting",
    date: "2025-03-29",
    concernPerson: "Prof. Davis",
    concernPersonPhone: "8765432109",
    phone: "2345678901",
    status: "pending",
    verified: false,
    vehicleNo: null,
    createdAt: new Date("2025-03-28"),
  },
];

const SecurityDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("studentApprovals");
  const [selectedStudentPass, setSelectedStudentPass] = useState(null);
  const [selectedVisitorPass, setSelectedVisitorPass] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [visitorQrOpen, setVisitorQrOpen] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  // Use sample data
  const [studentPasses, setStudentPasses] = useState();
  const [visitorPasses, setVisitorPasses] = useState([]);
  const [loadingStudentPasses, setLoadingStudentPasses] = useState(false);
  const [loadingVisitorPasses, setLoadingVisitorPasses] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [staffRole, setStaffRole] = useState("Security"); // Role is derived from the user data
  const [userId, setUserId] = useState("");
  const [name, setName] = useState({});
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("sessionToken");

      const req = await fetch(`${config.env.SERVER_URL}/api/security/profile`, {
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

      setUserId(data.id);
      setName({
        name: data.name,
        designation: "Security",
        department: "NIL",
      });
      const gatePass = await fetch(
        `${config.env.SERVER_URL}/api/gatepass/security/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const apiResponse = await gatePass.json();
      // console.log(apiResponse);
      const formattedData = apiResponse.map((item) => ({
        id: item.id,
        userId: item.student_id,
        date: item.date,
        fromTime: item.time,
        toTime: item.exit_time,
        reason: item.reason,
        status: item.status, // === "Approved" ? "approved" : "pending",
        verified:
          item.security_verification === "Approved" ? "approved" : "pending",
        createdAt: item.date,
        approvals: {
          advisor:
            item.class_advisor_approval === "Approved" ? "approved" : "pending",
          hod: item.hod_approval === "Approved" ? "approved" : "pending",
          principal:
            item.principal_approval === "Approved" ? "approved" : "pending",
        },
        vehicleNo: null,
        student: {
          name: item.student_name,
          department: item.department,
        },
      }));

      setStudentPasses(formattedData);

      const visitorPass = await fetch(
        `${config.env.SERVER_URL}/api/visitors/approved`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const apiResponse2 = await visitorPass.json();
      console.log(apiResponse2);
      const formattedVisitorPasses = apiResponse2.map((item) => {
        const expectedExit = new Date(item.expected_exit_time);

        // Format to 12-hour time with AM/PM
        const hours = expectedExit.getHours();
        const minutes = expectedExit.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        const hour12 = hours % 12 || 12;
        const expectedExitTime = `${hour12}:${minutes} ${ampm}`;
        return {
          id: item.id,
          visitorName: item.name,
          purpose: item.reason,
          date: item.in_time.split("T")[0],
          expectedExitTime: expectedExitTime,
          concernPerson: item.concerned_person_name,
          concernPersonPhone: null, // Not in original data
          phone: item.phone,
          status: item.status.toLowerCase(),
          verified: false, // Default value
          vehicleNo: null, // Default value
          createdAt: new Date(item.in_time),
        };
      });
      setVisitorPasses(formattedVisitorPasses);
    };
    fetchUser();
  }, []);
  const handleViewStudentPass = (pass) => {
    setSelectedStudentPass(pass);
    setDetailsOpen(true);
  };

  const handleViewVisitorPass = (pass) => {
    setSelectedVisitorPass(pass);
    setVisitorQrOpen(true);
  };

  const handleCallPerson = (name, phone) => {
    setContactInfo({ name, phone });
    setCallDialogOpen(true);
  };

  const makeCall = () => {
    if (contactInfo?.phone) {
      window.location.href = `tel:${contactInfo.phone}`;
      toast({
        title: "Calling",
        description: `Calling ${contactInfo.name}...`,
      });
      setCallDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header with navigation and profile */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-primary">
              Security Gate Pass Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              {/* <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link> */}
              <Link href="/security-profile">
                <span className="h-8 w-8 bg-slate-300 rounded-full flex items-center justify-center">
                  {name.name ? name.name.charAt(0) : "S"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        <div className="px-4 py-6 sm:px-0">
          <Tabs
            defaultValue="studentApprovals"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full">
              <TabsTrigger
                value="studentApprovals"
                className="text-xs md:text-sm"
              >
                Student Passes
              </TabsTrigger>
              <TabsTrigger
                value="visitorApprovals"
                className="text-xs md:text-sm"
              >
                Visitor Passes
              </TabsTrigger>

              {/* <TabsTrigger
                value="studentPassForm"
                className="text-xs md:text-sm"
              >
                Create Student Pass
              </TabsTrigger> */}
              <TabsTrigger
                value="visitorPassForm"
                className="text-xs md:text-sm"
              >
                Create Visitor Pass
              </TabsTrigger>
            </TabsList>

            {/* Student Approvals Tab */}
            <TabsContent value="studentApprovals">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-lg leading-6 font-medium text-slate-900">
                    Student Gate Pass Approvals
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-slate-500">
                    Pending and approved gate passes for students.
                  </p>
                </div>
                {loadingStudentPasses ? (
                  <div className="p-4 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : studentPasses && studentPasses.length > 0 ? (
                  <div>
                    {studentPasses.map((pass) => (
                      <StudentPassItem
                        key={pass.id}
                        gatePass={pass}
                        onView={() => handleViewStudentPass(pass)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-slate-600">
                      No student passes available at the moment.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Visitor Approvals Tab */}
            <TabsContent value="visitorApprovals">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-lg leading-6 font-medium text-slate-900">
                    Visitor Pass Approvals
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-slate-500">
                    Visitor passes for campus entry.
                  </p>
                </div>
                {loadingVisitorPasses ? (
                  <div className="p-4 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : visitorPasses && visitorPasses.length > 0 ? (
                  <div>
                    {visitorPasses.map((pass) => (
                      <VisitorPassItem
                        key={pass.id}
                        visitorPass={pass}
                        onCall={() =>
                          handleCallPerson(
                            pass.concernPerson,
                            pass.concernPersonPhone
                          )
                        }
                        onView={() => handleViewVisitorPass(pass)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-slate-600">
                      No visitor passes available at the moment.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Student Pass Form Tab */}
            <TabsContent value="studentPassForm">
              <StudentPassForm />
            </TabsContent>

            {/* Visitor Pass Form Tab */}
            <TabsContent value="visitorPassForm">
              <VisitorPassForm />
            </TabsContent>

            {/* QR Scanner Tab */}
            <TabsContent value="qrScanner">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-lg leading-6 font-medium text-slate-900">
                    QR Code Scanner
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-slate-500">
                    Scan student or visitor gate pass QR codes for verification.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <QRCodeScanner
                    onScanSuccess={(passId, passType) => {
                      toast({
                        title: "QR Code Scanned Successfully",
                        description: `${passType} pass ID: ${passId} verified.`,
                        variant: "success",
                      });
                    }}
                    onScanError={(error) => {
                      toast({
                        title: "QR Scan Error",
                        description: error,
                        variant: "destructive",
                      });
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Call dialog */}
      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Call {contactInfo?.name}</DialogTitle>
            <DialogDescription>
              You are about to call {contactInfo?.name} at {contactInfo?.phone}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCallDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={makeCall}>
              Call Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gate pass details */}
      <GatePassDetails
        gatePass={selectedStudentPass}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />

      {/* Visitor pass QR code */}
      {/* <Dialog open={visitorQrOpen} onOpenChange={setVisitorQrOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Visitor Pass QR Code</DialogTitle>
            <DialogDescription>
              Show this QR code to the visitor for entry verification.
            </DialogDescription>
          </DialogHeader>

          {selectedVisitorPass && (
            <VisitorPassQR visitorPass={selectedVisitorPass} />
          )}

          <DialogFooter className="sm:justify-center">
            <Button variant="outline" onClick={() => setVisitorQrOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default SecurityDashboard;
