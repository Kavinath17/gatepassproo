import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Upload,
  Phone,
  Mail,
  Calendar,
  MapPin,
  BookOpen,
  GraduationCap,
  UserCheck,
  Hash,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import PasswordChangeForm from "../components/PasswordChangeForm";
import { departments } from "../lib/type";
import { config } from "../lib/config";
const StaffProfile = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Sample staff profile data
  // const [profile, setProfile] = useState({
  //   name: "Prof. Samantha Parker",
  //   email: "samantha.parker@college.edu",
  //   phone: "9876543210",
  //   staffId: "FAC10045",
  //   department: "Computer Science",
  //   designation: "Associate Professor",
  //   role: "advisor", // advisor, hod, principal
  //   qualification: "Ph.D. in Computer Science",
  //   experience: "12",
  //   dob: "1980-06-15",
  //   address: "45 Faculty Housing Complex, College Campus",
  //   photoUrl: "https://i.pravatar.cc/150?img=50",
  // });

  const [profile, setProfile] = useState({});

  useEffect(() => {
    setLoading(true);
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

      const formattedStaffData = {
        name: data.designation === "warden" ? data.name : `Prof. ${data.name}`,
        email: data.email,
        phone: data.phone,
        staffId: data.staff_code,
        department: data.designation === "warden" ? "NIL" : data.department,
        designation: data.designation,
        role: "advisor",
      };

      setProfile(formattedStaffData);
      setLoading(false);
    };
    fetchUser();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setProfile({ ...profile, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, we would upload the file to a server
      // For demo, just update the profile state with the selected file
      const reader = new FileReader();
      reader.onload = () => {
        setProfile({ ...profile, photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description:
          error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = () => {
    switch (profile.role) {
      case "advisor":
        return "Class Advisor";
      case "hod":
        return "Head of Department";
      case "principal":
        return "Principal";
      default:
        return "Faculty";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-primary">Staff Profile</h1>
            <div className="flex items-center space-x-4">
              <Link href="/staff-dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Card */}
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex justify-center mb-4">
                    {/* <span className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-semibold">
                      {profile.name[0].toUpperCase()}
                    </span> */}

                    {/* <Avatar className="h-32 w-32">
                      <AvatarImage src={profile.photoUrl} alt={profile.name} />
                      <AvatarFallback>
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar> */}
                  </div>
                  <h2 className="text-xl font-bold capitalize">
                    {profile.name}
                  </h2>
                  {profile.designation !== "warden" ? (
                    <p className="text-slate-600 mt-1">{profile.department}</p>
                  ) : (
                    <p className="text-slate-600 mt-1">Warden</p>
                  )}
                  <p className="text-slate-600">{profile.college}</p>

                  <div className="mt-6 space-y-3 text-left">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">SIN: {profile.staffId}</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">DOB: {profile.dob}</span>
                    </div> */}
                    {/* <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">
                        {profile.residence === "hostel"
                          ? "Hostel Resident"
                          : "Day Scholar"}
                      </span>
                    </div> */}
                    {/* {profile.residence === "hostel" && (
                      <div className="flex items-center gap-2">
                        <div className="w-4"></div>
                        <span className="text-sm">{profile.address}</span>
                      </div>
                    )} */}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-6 w-full"
                    onClick={() => navigate("/student-dashboard")}
                  >
                    Back to Dashboard
                  </Button>

                  {/* <PasswordChangeForm /> */}
                </CardContent>
              </Card>
            </div>

            {/* Edit Form */}
            <div className="w-full md:w-2/3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profile.name}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profile.email}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="sin">Student ID Number (SIN)</Label>
                        <Input
                          id="sin"
                          name="sin"
                          value={profile.sin}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div> */}
                      {/* <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          name="dob"
                          type="date"
                          value={profile.dob}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div> */}
                      <div className="space-y-2">
                        <Label htmlFor="college">College</Label>
                        <Input
                          id="college"
                          name="college"
                          value={
                            profile.college ||
                            "Sri Shanmugha College of Engineering and Technology"
                          }
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div>
                      {profile.designation !== "warden" && (
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select
                            name="department"
                            value={profile.department}
                            disabled
                          >
                            <SelectTrigger id="department">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((department) => (
                                <SelectItem key={department} value={department}>
                                  {department}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <Separator />
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffProfile;
