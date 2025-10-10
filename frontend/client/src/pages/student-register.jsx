import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CollegeLogo from "@/components/ui/college-logo";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { departments } from "../lib/type";
import { config } from "../lib/config";
const formSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  sin: z.string().min(1, "Student ID is required"),
  email: z.string().email("Invalid email format"),
  address: z.string().min(6, "Address is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dob: z.string().min(1, "Date of Birth is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  department: z.string().min(1, "Department is required"),
  year: z.string().min(1, "Year is required"),
  residence: z.string().min(1, "Residence type is required"),
});

const StudentRegister = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const student_data = {
        name: data.name,
        email: data.email,
        password: data.password,
        year: data.year,
        sin_number: data.sin,
        department: data.department,
        phone: data.phone,
        dob: data.dob,
        address: data.address,
        type: data.residence,
      };

      console.log(student_data);
      const req = await fetch(
        `${config.env.SERVER_URL}/api/students/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(student_data),
        }
      );

      const res = await req.json();

      if (res.message != "Student registered successfully!") {
        toast({
          title: "Registration failed",
          description: "Your account creation failed.",
        });
      } else {
        toast({
          title: "Registration successful",
          description: "Your account has been created.",
        });
        navigate("/login");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description:
          error.message || "Failed to create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[url(./ShanmughaImages-02.jpg)] bg-cover bg-center from-primary/5 to-primary/10 p-4">
      <div className="absolute h-full bg-cover bg-center  bg-gray-500 bg-opacity-50"></div>
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden realtive z-10">
        <div className="text-center pt-8">
          <div className="flex justify-center mb-4">
            <CollegeLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Create Account</h1>
          <p className="text-slate-600 mt-1">
            Register for College Gate Pass System
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} placeholder="John Doe" />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sin">Student ID Number (SIN)</Label>
              <Input id="sin" {...register("sin")} />
              {errors.sin && (
                <p className="text-red-500 text-sm">{errors.sin.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">College Email</Label>
              <Input
                id="email"
                {...register("email")}
                type="email"
                placeholder="john.doe@college.edu"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register("phone")}
                type="tel"
                placeholder="1234567890"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Student Address</Label>
              <Input id="address" {...register("address")} />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" {...register("dob")} type="date" />
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select onValueChange={(value) => setValue("department", value)}>
                <SelectTrigger>
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
              <Select onValueChange={(value) => setValue("year", value)}>
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label htmlFor="residence">Residence Type</Label>
              <Select onValueChange={(value) => setValue("residence", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select residence type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hosteller">Hostel Resident</SelectItem>
                  <SelectItem value="Day Scholar">Day Scholar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                {...register("password")}
                type="password"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
