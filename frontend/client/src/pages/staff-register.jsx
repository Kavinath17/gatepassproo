import { useState } from "react";
import { useLocation } from "wouter";

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
  staffId: z.string().min(1, "Staff ID is required"),
  email: z.string().email("Invalid email format"),
  department: z.string().min(1, "Department is required"),
  role: z.string().min(1, "Role is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const StaffRegister = () => {
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
      const staff_data = {
        staff_code: data.staffId,
        name: data.name,
        email: data.email,
        password: data.password,
        department: data.department,
        designation: data.role,
        phone: data.phone,
      };
      console.log(staff_data);
      const req = await fetch(`${config.env.SERVER_URL}/api/staff/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...staff_data,
        }),
      });
      if (req.status == 201) {
        toast({
          title: "Registration successful",
          description: "Your account has been created.",
        });
        navigate("/staff-login");
      } else {
        throw new Error("Failed to create account. Please try again.");
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
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="text-center pt-8">
          <div className="flex justify-center mb-4">
            <CollegeLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-primary">
            Staff Registration
          </h1>
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
              <Label htmlFor="staffId">Staff ID</Label>
              <Input id="staffId" {...register("staffId")} />
              {errors.staffId && (
                <p className="text-red-500 text-sm">{errors.staffId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="department">Department</Label>
              <Select
                id="department"
                onValueChange={(value) => setValue("department", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((designation) => (
                    <SelectItem key={designation} value={designation}>
                      {designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-red-500 text-sm">
                  {errors.department.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Designation</Label>
              <Select
                id="role"
                onValueChange={(value) => setValue("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Warden">Warden</SelectItem>
                  <SelectItem value="HOD">HOD</SelectItem>
                  <SelectItem value="Professor">Professor</SelectItem>
                  <SelectItem value="Principal">Principal</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role.message}</p>
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
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffRegister;
