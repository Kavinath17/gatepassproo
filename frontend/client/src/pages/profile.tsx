import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const profileSchema = z.object({
  college: z.string(),
  studentId: z.string(),
  department: z.string(),
  year: z.string(),
  studentType: z.string(),
  phone: z.string().min(10, { message: "Phone number must be valid" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electronics & Communication",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const studentTypes = ["Day Scholar", "Hosteller"];

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      college: profile?.college || "Engineering College",
      studentId: profile?.studentId || "",
      department: profile?.department || "",
      year: profile?.year || "",
      studentType: profile?.studentType || "",
      phone: profile?.phone || user?.phone || "",
    },
  });

  // Update form when profile data is loaded
  if (profile && !form.formState.isDirty) {
    form.reset({
      college: profile.college || "Engineering College",
      studentId: profile.studentId || "",
      department: profile.department || "",
      year: profile.year || "",
      studentType: profile.studentType || "",
      phone: profile.phone || user?.phone || "",
    });
  }

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormValues) =>
      apiRequest("PUT", "/api/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Please try again later",
      });
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("photo", file);
      return fetch("/api/profile/photo", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Photo updated",
        description: "Your profile photo has been updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Photo upload failed",
        description: "Failed to upload photo. Please try again.",
      });
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate(data);
    
    if (photoFile) {
      uploadPhotoMutation.mutate(photoFile);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex justify-center">
          <div className="animate-pulse h-96 w-full max-w-3xl bg-white rounded-lg shadow"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-lg leading-6 font-medium text-slate-900">
                Profile Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Personal details and application settings.
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="sm:flex-shrink-0">
                  <div className="relative">
                    <Avatar className="h-24 w-24 cursor-pointer">
                      <AvatarImage 
                        src={photoPreview || user?.photoUrl || ""} 
                        alt={user?.name || "Profile"} 
                      />
                      <AvatarFallback>
                        {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm hover:bg-slate-50 cursor-pointer">
                      <Camera className="h-4 w-4 text-slate-500" />
                      <input 
                        id="photo-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-1">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        <FormField
                          control={form.control}
                          name="college"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>College</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  readOnly
                                  className="bg-slate-50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="studentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Student ID / SIN No</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  readOnly
                                  className="bg-slate-50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                      {dept}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="studentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Student Type</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {studentTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+91 9876543210"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="mt-8 flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => form.reset()}
                          className="mr-3"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={updateMutation.isPending || uploadPhotoMutation.isPending}
                        >
                          {(updateMutation.isPending || uploadPhotoMutation.isPending) ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
