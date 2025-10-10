import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Upload,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Shield,
  Building,
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
import { config } from "../lib/config";

const SecurityProfile = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Sample security profile data
  const [profile, setProfile] = useState({
    name: "David Jones",
    email: "david.jones@college.edu",
    phone: "9876543210",
    securityId: "SEC78901",
    gateNumber: "2",
    dob: "1985-05-22",
    address: "123 Security Staff Quarters, College Campus",
    photoUrl: "https://i.pravatar.cc/150?img=68",
  });

  useEffect(() => {
    setLoading(true);
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

      const formattedStaffData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        securityId: "SEC1",
        department: "NIL",
        designation: "Security",
        role: "Security",
      };

      //   name: "David Jones",
      // email: "david.jones@college.edu",
      // phone: "9876543210",
      // securityId: "SEC78901",
      // gateNumber: "2",
      // dob: "1985-05-22",
      // address: "123 Security Staff Quarters, College Campus",
      // photoUrl: "https://i.pravatar.cc/150?img=68"

      setProfile(formattedStaffData);
      //   setLoading(false);
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-primary">Security Profile</h1>
            <div className="flex items-center space-x-4">
              <Link href="/security-dashboard">
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
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={profile.photoUrl} alt={profile.name} />
                      <AvatarFallback>
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-sm font-medium mt-2">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Security Staff</span>
                  </div>

                  <div className="mt-6 space-y-3 text-left">
                    {/* <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">ID: {profile.securityId}</span>
                    </div> */}
                    {/* <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">
                        Gate: {profile.gateNumber}
                      </span>
                    </div> */}
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">DOB: {profile.dob}</span>
                    </div> */}
                    {/* <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                      <span className="text-sm">{profile.address}</span>
                    </div> */}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-6 w-full"
                    onClick={() => navigate("/security-dashboard")}
                  >
                    Back to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Edit Form */}
            <div className="w-full md:w-2/3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Edit Profile</CardTitle>
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
                          disabled
                        />
                      </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="securityId">Security ID</Label>
                        <Input
                          id="securityId"
                          name="securityId"
                          value={profile.securityId}
                          onChange={handleInputChange}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          name="dob"
                          type="date"
                          value={profile.dob}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gateNumber">Gate Number</Label>
                        <Select
                          name="gateNumber"
                          value={profile.gateNumber}
                          onValueChange={(value) =>
                            handleSelectChange("gateNumber", value)
                          }
                        >
                          <SelectTrigger id="gateNumber">
                            <SelectValue placeholder="Select gate" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Gate 1 (Main)</SelectItem>
                            <SelectItem value="2">Gate 2 (East)</SelectItem>
                            <SelectItem value="3">Gate 3 (West)</SelectItem>
                            <SelectItem value="4">Gate 4 (Hostel)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div> */}
                    </div>

                    {/* <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="address">Residential Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Enter your full address"
                        required
                      />
                    </div> */}

                    {/* <Separator />

                    <div className="space-y-3">
                      <Label htmlFor="photo">Profile Photo</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={profile.photoUrl}
                            alt={profile.name}
                          />
                          <AvatarFallback>
                            {profile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Label
                            htmlFor="photo-upload"
                            className="cursor-pointer inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors"
                          >
                            <Upload className="h-4 w-4" />
                            Upload photo
                          </Label>
                          <Input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            JPEG, PNG or GIF, max 2MB
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div> */}
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

export default SecurityProfile;
