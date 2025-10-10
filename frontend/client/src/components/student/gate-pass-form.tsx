import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertGatePassSchema } from "@shared/schema";

interface GatePassFormProps {
  open: boolean;
  onClose: () => void;
}

const gatePassSchema = insertGatePassSchema.extend({
  date: z.string().min(1, { message: "Date is required" }),
  fromTime: z.string().min(1, { message: "From time is required" }),
  toTime: z.string().min(1, { message: "To time is required" }),
  reason: z
    .string()
    .min(5, { message: "Reason must be at least 5 characters" })
    .max(200, { message: "Reason must not exceed 200 characters" }),
});

type GatePassFormValues = z.infer<typeof gatePassSchema>;

const GatePassForm = ({ open, onClose }: GatePassFormProps) => {
  const { toast } = useToast();
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const form = useForm<GatePassFormValues>({
    resolver: zodResolver(gatePassSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      fromTime: "",
      toTime: "",
      reason: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: GatePassFormValues) =>
      apiRequest("POST", "/api/gate-passes", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gate-passes"] });
      setSuccessModalOpen(true);
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create gate pass",
        description: error.message || "Please try again later",
      });
    },
  });

  const onSubmit = (data: GatePassFormValues) => {
    createMutation.mutate(data);
  };

  const handleCloseWithSuccess = () => {
    setSuccessModalOpen(false);
    onClose();
  };

  // Show success modal instead of the form if submission was successful
  if (successModalOpen) {
    return (
      <Dialog open={true} onOpenChange={handleCloseWithSuccess}>
        <DialogContent className="text-center p-6 max-w-md">
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
            Gate Pass Submitted Successfully
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mb-4">
            Your gate pass application has been submitted and is pending approval.
          </DialogDescription>
          <Button
            onClick={handleCloseWithSuccess}
            className="w-full"
            size="lg"
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium">
              New Gate Pass Application
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Fill out the form to request a new gate pass.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromTime"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
                    <FormLabel>To Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide a detailed reason for your gate pass request"
                      className="resize-none"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GatePassForm;
