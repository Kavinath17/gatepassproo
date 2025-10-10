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
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddSecurityForm = ({ onClose }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    securityId: "",
    email: "",
    name: "",
    phone: "",
    dob: "",
    address: "",
    gateNumber: "",
    shift: "",
    joinDate: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { securityId, email, name, phone, dob, address, gateNumber, shift, joinDate, password, confirmPassword } = formData;
    const errors = [];

    if (!securityId) errors.push("Security ID is required");
    if (!email) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Email is invalid");
    if (!name) errors.push("Name is required");
    if (!phone) errors.push("Phone Number is required");
    if (!dob) errors.push("Date of Birth is required");
    if (!address) errors.push("Address is required");
    if (!gateNumber) errors.push("Gate Number is required");
    if (!shift) errors.push("Shift is required");
    if (!joinDate) errors.push("Join Date is required");
    if (!password) errors.push("Password is required");
    else if (password.length < 6) errors.push("Password must be at least 6 characters");
    if (password !== confirmPassword) errors.push("Passwords do not match");

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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Security personnel added",
        description: "Security personnel account has been created successfully.",
      });
      
      // Reset form and close dialog
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add security personnel",
        description: error.message || "Failed to create security personnel account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Security Personnel</DialogTitle>
          <DialogDescription>
            Create a new security personnel account by filling in the required details
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="securityId">Security ID *</Label>
              <Input
                id="securityId"
                name="securityId"
                value={formData.securityId}
                onChange={handleChange}
                placeholder="Security ID Number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email ID *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="security@college.edu"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date *</Label>
              <Input
                id="joinDate"
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gateNumber">Gate Number *</Label>
              <Select 
                name="gateNumber" 
                value={formData.gateNumber}
                onValueChange={(value) => handleSelectChange("gateNumber", value)}
                required
              >
                <SelectTrigger id="gateNumber">
                  <SelectValue placeholder="Select Gate Number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Gate 1 (Main Entrance)</SelectItem>
                  <SelectItem value="2">Gate 2 (Back Entrance)</SelectItem>
                  <SelectItem value="3">Gate 3 (Hostel Entrance)</SelectItem>
                  <SelectItem value="4">Gate 4 (Staff Entrance)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shift">Shift *</Label>
              <Select 
                name="shift" 
                value={formData.shift}
                onValueChange={(value) => handleSelectChange("shift", value)}
                required
              >
                <SelectTrigger id="shift">
                  <SelectValue placeholder="Select Shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (6 AM - 2 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (2 PM - 10 PM)</SelectItem>
                  <SelectItem value="night">Night (10 PM - 6 AM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Residential Address"
              required
            />
          </div>
          
          <Separator className="my-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Password"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Security Personnel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSecurityForm;