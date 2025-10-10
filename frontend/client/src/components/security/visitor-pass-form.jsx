import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Phone, MessageSquare } from "lucide-react";

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
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertVisitorPassSchema } from "@shared/schema";
import { config } from "../../lib/config";

// Extend schema with required fields
const visitorPassSchema = insertVisitorPassSchema.extend({
  visitorName: z.string().min(1, { message: "Visitor name is required" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  vehicleNo: z.string().optional(),
  date: z.string().min(1, { message: "Date is required" }),
  inTime: z.string().min(1, { message: "In-time is required" }),
  expectedExitTime: z
    .string()
    .min(1, { message: "Expected exit time is required" }),
  purpose: z
    .string()
    .min(5, { message: "Purpose must be at least 5 characters" }),
  concernPerson: z.string().min(1, { message: "Person to visit is required" }),
  concernPersonPhone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
});

const VisitorPassForm = () => {
  const { toast } = useToast();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdVisitorPass, setCreatedVisitorPass] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(visitorPassSchema),
    defaultValues: {
      visitorName: "",
      phone: "",
      vehicleNo: "",
      date: new Date().toISOString().split("T")[0],
      inTime: "",
      expectedExitTime: "",
      purpose: "",
      concernPerson: "",
      concernPersonPhone: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = {
      name: data.visitorName,
      phone: data.phone,
      vehicle_no: data.vehicleNo || null,
      reason: data.purpose,
      in_time: new Date(data.inTime)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      expected_exit_time: new Date(data.expectedExitTime)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      concerned_person_name: data.concernPerson,
      concerned_person_phone: data.concernPersonPhone,
    };

    const req = await fetch(`${config.env.SERVER_URL}/api/visitors/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
      },
      body: JSON.stringify({ ...formData }),
    });
    const res = await req.json();
    if (req.status === 201) {
      // Simulate API call for verification
      toast({
        title: "Visitor pass Created",
        description: "Visitor pass has been creator successfully.",
      });
    } else {
      toast({
        title: "Visitor Pass Error",
        description: "Error while creating the visitor pass.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const handleCall = () => {
    if (createdVisitorPass?.concernPersonPhone) {
      window.location.href = `tel:${createdVisitorPass.concernPersonPhone}`;
    }
  };

  const handleSMS = () => {
    if (createdVisitorPass?.concernPersonPhone) {
      window.location.href = `sms:${createdVisitorPass.concernPersonPhone}?body=A visitor pass has been created for you. Pass ID: ${createdVisitorPass.id}`;
    }
  };

  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
    setCreatedVisitorPass(null);
  };

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 bg-slate-50 border-b border-slate-200">
          <h3 className="text-lg leading-6 font-medium text-slate-900">
            Create Visitor Pass
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Issue a new pass for a visitor.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <FormField
                  control={form.control}
                  name="visitorName"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Visitor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Robert Brown" {...field} />
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
                      <FormLabel>Visitor Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} />
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
                      <FormLabel>Vehicle Number</FormLabel>
                      <FormControl>
                        <Input placeholder="KL01AB1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inTime"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>In Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedExitTime"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Expected Exit Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="concernPerson"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Person to Visit</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. Michael Anderson" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="concernPersonPhone"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Concern Person's Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-6">
                      <FormLabel>Purpose of Visit</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide the purpose of visit"
                          rows={2}
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Pass"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <Dialog open={successModalOpen} onOpenChange={closeSuccessModal}>
        <DialogContent className="text-center p-6 max-w-md">
          <DialogHeader>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <DialogTitle className="text-lg font-medium text-slate-900 mb-2">
              Visitor Pass Created Successfully
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 mb-4">
              Visitor pass has been created and is ready for use.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button
              onClick={handleCall}
              className="flex items-center justify-center"
            >
              <Phone className="mr-2 h-4 w-4" /> Call Person
            </Button>
            <Button
              onClick={handleSMS}
              className="flex items-center justify-center"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Send SMS
            </Button>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeSuccessModal}
              className="w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisitorPassForm;
