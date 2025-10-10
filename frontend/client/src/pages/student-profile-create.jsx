import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  Upload,
  User,
  Phone,
  Mail,
  School,
  Home,
  BookOpen,
  Hash,
  Calendar,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PasswordChangeForm from "../components/PasswordChangeForm";

const StudentProfileCreate = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Sample student profile data
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    department: "",
    year: "",
    sin: "",
    dob: "",
    residence: "",
    address: "",
    photoUrl: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setProfile({ ...profile, [name]: value });
  };

  const handleRadioChange = (value) => {
    setProfile({ ...profile, residence: value });
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
        title: "Profile created",
        description: "Your profile has been created successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Create failed",
        description:
          error.message || "Failed to create profile. Please try again.",
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
            <h1 className="text-xl font-bold text-primary">Student Profile</h1>
            <div className="flex items-center space-x-4">
              <Link href="/student-dashboard">
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
            {/* Edit Form */}
            <div className="w-full md:w-2/3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Create Profile Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sin">Student ID Number (SIN)</Label>
                        <Input
                          id="sin"
                          name="sin"
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          name="dob"
                          type="date"
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="college">College</Label>
                        <Input
                          id="college"
                          name="college"
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          name="department"
                          onValueChange={(value) =>
                            handleSelectChange("department", value)
                          }
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
                      <div className="space-y-2">
                        <Label htmlFor="year">Year of Study</Label>
                        <Select
                          name="year"
                          onValueChange={(value) =>
                            handleSelectChange("year", value)
                          }
                        >
                          <SelectTrigger id="year">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st Year</SelectItem>
                            <SelectItem value="2">2nd Year</SelectItem>
                            <SelectItem value="3">3rd Year</SelectItem>
                            <SelectItem value="4">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Residence Type</Label>
                      <RadioGroup
                        onValueChange={handleRadioChange}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hostel" id="hostel" />
                          <Label htmlFor="hostel">Hostel Resident</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="day" id="day" />
                          <Label htmlFor="day">Day Scholar</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {profile.residence === "hostel" && (
                      <div className="space-y-2">
                        <Label htmlFor="address">Hostel Address</Label>
                        <Input
                          id="address"
                          name="address"
                          onChange={handleInputChange}
                          placeholder="Room number, block, etc."
                        />
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
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

export default StudentProfileCreate;
