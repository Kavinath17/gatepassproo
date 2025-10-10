import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { departments } from "@/lib/type";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertGatePassSchema } from "@shared/schema";

const studentPassSchema = insertGatePassSchema.extend({
  studentId: z.string().min(1, { message: "Student ID is required" }),
  studentName: z.string().min(1, { message: "Student name is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  fromTime: z.string().min(1, { message: "From time is required" }),
  toTime: z.string().min(1, { message: "To time is required" }),
  vehicleNo: z.string().optional(),
  reason: z.string().min(5, { message: "Reason must be at least 5 characters" }),
});

type StudentPassFormValues = z.infer<typeof studentPassSchema>;



const StudentPassForm = () => {
  const { toast } = useToast();
  const [resetForm, setResetForm] = useState(false);

  const form = useForm<StudentPassFormValues>({
    resolver: zodResolver(studentPassSchema),
    defaultValues: {
      studentId: "",
      studentName: "",
      department: "",
      phone: "",
      date: new Date().toISOString().split("T")[0],
      fromTime: "",
      toTime: "",
      vehicleNo: "",
      reason: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: StudentPassFormValues) =>
      apiRequest("POST", "/api/security/student-passes", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gate-passes"] });
      toast({
        title: "Success",
        description: "Student gate pass has been created successfully!",
      });
      form.reset();
      setResetForm(true);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create gate pass",
        description: error.message || "Please try again later",
      });
    },
  });

  const onSubmit = (data: StudentPassFormValues) => {
    createMutation.mutate(data);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6 bg-slate-50 border-b border-slate-200">
        <h3 className="text-lg leading-6 font-medium text-slate-900">
          Create Student Gate Pass
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Issue a new gate pass for a student.
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder="EC19CS047" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
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
                name="date"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleNo"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Vehicle Number (if any)</FormLabel>
                    <FormControl>
                      <Input placeholder="KL01AB1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fromTime"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>From Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toTime"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>To Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="sm:col-span-6">
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a detailed reason for the gate pass"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
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
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create Pass"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default StudentPassForm;
