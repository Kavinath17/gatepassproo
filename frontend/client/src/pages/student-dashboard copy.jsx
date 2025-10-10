import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Plus, Home, User, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import GatePassCard from "@/components/student/gate-pass-card";
import GatePassForm from "@/components/student/gate-pass-form";
import GatePassDetails from "@/components/student/gate-pass-details";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CollegeLogo from "../components/ui/college-logo";
import { config } from "../lib/config";
function formatTime(time) {
  if (!time || typeof time !== "string") return "";
  if (time.includes(":")) {
    return time.slice(0, 5); // "10:00:00" → "10:00"
  }
  return time;
}
const StudentDashboard = () => {
  const [, navigate] = useLocation();
  const session = localStorage.getItem("sessionToken");
  if (!session) navigate("/login");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gatePasses, setGatePasses] = useState([]);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchUser = async () => {
      const req = await fetch(`${config.env.SERVER_URL}/api/students/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await req.json();
      if (!userData.id) {
        throw new Error("Server Error");
      }
      setUserId(userData.id);
      setUserName(userData.name);

      const gatePass = await fetch(
        `${config.env.SERVER_URL}/api/gatepass/${userData.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const apiResponse = await gatePass.json();

      const formattedData = apiResponse.map((item) => ({
        id: item.id,
        userId: item.student_id,
        date: item.date?.split("T")[0] || "",
        fromTime: formatTime(item.time),
        toTime: formatTime(item.exit_time),
        reason: item.reason,
        status: item.status?.toLowerCase() || "pending",
        verified: item.security_verification === "Approved",
        createdAt: new Date(item.date),
        approvals: {
          advisor: item.class_advisor_approval === "Approved",
          hod: item.hod_approval === "Approved",
          principal: item.principal_approval === "Approved",
        },
        vehicleNo: null, // can update if needed later
        student: {
          name: item.name,
          department: item.department,
        },
      }));
      setGatePasses(formattedData);
    };
    fetchUser();
  }, []);
  const handleLogOut = () => {
    localStorage.removeItem("sessionToken");
    navigate("/login");
  };

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  const handleViewPass = (gatePass) => {
    setSelectedPass(gatePass);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedPass(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header with navigation and profile */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex gap-2 items-center">
              {/* <CollegeLogo size="lg" className="w-[270px] py-4" /> */}
              <h1 className="text-xl font-bold text-primary">
                Student Gate Pass Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleLogOut}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>

              <Link href="/student-profile">
                Profile
                {/* <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage
                    src="https://i.pravatar.cc/150?img=32"
                    alt="Profile"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar> */}
                {/* {userName && (
                  <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                    {userName[0].toUpperCase()}
                  </span>
                )} */}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">
              My Gate Passes
            </h1>
            <Button onClick={handleOpenForm} className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              New Gate Pass
            </Button>
          </div>

          {/* Gate pass list */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-md" />
              ))}
            </div>
          ) : gatePasses && gatePasses.length > 0 ? (
            <div className="space-y-4">
              {gatePasses.map((gatePass) => (
                <GatePassCard
                  key={gatePass.id}
                  gatePass={gatePass}
                  onClick={() => handleViewPass(gatePass)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md p-8 text-center">
              <p className="text-slate-600">
                You haven't created any gate passes yet.
              </p>
              <Button onClick={handleOpenForm} className="mt-4">
                Create your first gate pass
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Form modal */}
      <GatePassForm open={formOpen} onClose={handleCloseForm} userId={userId} />

      {/* Details modal */}
      <GatePassDetails
        gatePass={selectedPass}
        open={detailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default StudentDashboard;
