import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";
import { config } from "../../lib/config";
const GatePassForm = ({ open, onClose, userId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    fromTime: "",

    reason: "",
    vehicleNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { date, fromTime, reason } = formData;
    const errors = [];

    if (!date) errors.push("Date is required");
    if (!fromTime) errors.push("From time is required");
    if (!reason) errors.push("Reason is required");

    // Check if "from time" is before "to time"
    // if (fromTime &&toTime  && fromTime >= toTime) {
    //   errors.push("From time must be before to time");
    // }

    // Check if date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.push("Date cannot be in the past");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errors.join(". "),
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate API call

      const finalData = {
        student_id: userId,
        reason: formData.reason,
        date: formData.date,
        time: formData.fromTime,
      };

      const sessionId = localStorage.getItem("sessionToken");

      const req = await fetch(`${config.env.SERVER_URL}/api/gatepass/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify({
          ...finalData,
        }),
      });
      console.log("req", req);
      // const req = await fetch("http://localhost:5000/api/gatepass/submit", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${sessionId}`,
      //   },
      //   body: JSON.stringify({
      //     student_id: userId,
      //     reason: formData.reason,
      //     date: formData.date,
      //     time: formData.fromTime,
      //   }),
      // });

      const res = await req.json();
      if (res.gatePassId) {
        toast({
          title: "Gate pass submitted",
          description:
            "Your gate pass has been submitted successfully and is pending approval.",
        });
      } else {
        throw new Error("Failed to submit gate pass. Please try again.");
      }

      // Reset form and close dialog
      setFormData({
        date: "",
        fromTime: "",

        reason: "",
        vehicleNo: "",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description:
          error.message || "Failed to submit gate pass. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Gate Pass</DialogTitle>
          <DialogDescription>
            Fill in the details to request a new gate pass
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromTime">Time</Label>
              <Input
                id="fromTime"
                name="fromTime"
                type="time"
                value={formData.fromTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Please provide detailed reason for your gate pass"
              rows={3}
              required
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="vehicleNo">Vehicle Number (Optional)</Label>
            <Input
              id="vehicleNo"
              name="vehicleNo"
              value={formData.vehicleNo}
              onChange={handleChange}
              placeholder="If you're taking a vehicle"
            />
          </div> */}

          <div className="pt-2 text-sm text-slate-500">
            <p>
              Note: Your request will go through the following approval process:
            </p>
            <ol className="list-decimal pl-5 mt-1 space-y-1">
              <li>Class Advisor</li>
              <li>Head of Department</li>
              <li>Principal</li>
              <li>Security Verification (at gate)</li>
            </ol>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GatePassForm;
