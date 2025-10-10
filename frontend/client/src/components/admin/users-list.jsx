import { useState } from "react";
import { Search, Filter, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Sample user data
const sampleUsers = {
  students: [
    { id: 1, name: "John Smith", email: "john.smith@college.edu", department: "Computer Science", year: "3", type: "Hostel", sinNumber: "S101293" },
    { id: 2, name: "Emma Johnson", email: "emma.j@college.edu", department: "Information Technology", year: "2", type: "Day Scholar", sinNumber: "S102384" },
    { id: 3, name: "Michael Chen", email: "m.chen@college.edu", department: "Electrical Engineering", year: "4", type: "Hostel", sinNumber: "S105672" }
  ],
  staff: [
    { id: 1, name: "Dr. Sarah Parker", email: "s.parker@college.edu", department: "Computer Science", role: "Class Advisor", designation: "Associate Professor" },
    { id: 2, name: "Prof. James Wilson", email: "j.wilson@college.edu", department: "Mechanical Engineering", role: "HOD", designation: "Professor" },
    { id: 3, name: "Dr. Emily White", email: "e.white@college.edu", department: "Information Technology", role: "Class Advisor", designation: "Assistant Professor" }
  ],
  security: [
    { id: 1, name: "Robert Davis", email: "r.davis@college.edu", gateNumber: "1", shift: "Morning" },
    { id: 2, name: "George Thompson", email: "g.thompson@college.edu", gateNumber: "2", shift: "Afternoon" },
    { id: 3, name: "Samuel Brown", email: "s.brown@college.edu", gateNumber: "3", shift: "Night" }
  ]
};

const UsersList = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = (userType) => {
    return sampleUsers[userType].filter(user => {
      // Search term filter
      const searchMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Department filter (for students and staff)
      const departmentMatch = !departmentFilter || departmentFilter === "all" || 
                              (user.department && user.department.toLowerCase() === departmentFilter.toLowerCase());
      
      // Year filter (for students)
      const yearMatch = !yearFilter || yearFilter === "all" || 
                       (userType === "students" && user.year === yearFilter);
      
      // Role filter (for staff)
      const roleMatch = !roleFilter || roleFilter === "all" || 
                        (userType === "staff" && user.role.toLowerCase() === roleFilter.toLowerCase());
      
      // Shift filter (for security)
      const shiftMatch = !shiftFilter || shiftFilter === "all" || 
                         (userType === "security" && user.shift.toLowerCase() === shiftFilter.toLowerCase());
      
      if (userType === "students") {
        return searchMatch && departmentMatch && yearMatch;
      } else if (userType === "staff") {
        return searchMatch && departmentMatch && roleMatch;
      } else if (userType === "security") {
        return searchMatch && shiftMatch;
      }
      
      return searchMatch;
    });
  };

  const renderStudentsList = () => {
    const students = filteredUsers("students");
    
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>
      );
    }
    
    if (students.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-slate-500">No students found matching your criteria.</p>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left font-medium text-slate-500">Name</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">SIN Number</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Department</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Year</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Type</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{student.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{student.sinNumber}</td>
                <td className="px-4 py-3 text-slate-700">{student.email}</td>
                <td className="px-4 py-3 text-slate-700">{student.department}</td>
                <td className="px-4 py-3 text-slate-700">{student.year}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={student.type === "Hostel" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"}>
                    {student.type}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderStaffList = () => {
    const staff = filteredUsers("staff");
    
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>
      );
    }
    
    if (staff.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-slate-500">No staff found matching your criteria.</p>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left font-medium text-slate-500">Name</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Department</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Designation</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Role</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((staff) => (
              <tr key={staff.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{staff.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{staff.email}</td>
                <td className="px-4 py-3 text-slate-700">{staff.department}</td>
                <td className="px-4 py-3 text-slate-700">{staff.designation}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={
                    staff.role === "HOD" ? "bg-purple-50 text-purple-700 border-purple-200" : 
                    staff.role === "Principal" ? "bg-red-50 text-red-700 border-red-200" : 
                    "bg-blue-50 text-blue-700 border-blue-200"
                  }>
                    {staff.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSecurityList = () => {
    const security = filteredUsers("security");
    
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>
      );
    }
    
    if (security.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-slate-500">No security personnel found matching your criteria.</p>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left font-medium text-slate-500">Name</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Gate Number</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Shift</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {security.map((security) => (
              <tr key={security.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{security.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{security.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{security.email}</td>
                <td className="px-4 py-3 text-slate-700">Gate {security.gateNumber}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={
                    security.shift === "Morning" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : 
                    security.shift === "Afternoon" ? "bg-blue-50 text-blue-700 border-blue-200" : 
                    "bg-indigo-50 text-indigo-700 border-indigo-200"
                  }>
                    {security.shift}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        {activeTab === "students" && (
          <>
            <Select value={departmentFilter || "all"} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Information Technology">Information Technology</SelectItem>
                <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={yearFilter || "all"} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="1">First Year</SelectItem>
                <SelectItem value="2">Second Year</SelectItem>
                <SelectItem value="3">Third Year</SelectItem>
                <SelectItem value="4">Fourth Year</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
        
        {activeTab === "staff" && (
          <>
            <Select value={departmentFilter || "all"} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Information Technology">Information Technology</SelectItem>
                <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={roleFilter || "all"} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Class Advisor">Class Advisor</SelectItem>
                <SelectItem value="HOD">HOD</SelectItem>
                <SelectItem value="Principal">Principal</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
        
        {activeTab === "security" && (
          <Select value={shiftFilter || "all"} onValueChange={setShiftFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Shifts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Afternoon">Afternoon</SelectItem>
              <SelectItem value="Night">Night</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      
      {/* Tabs for Different User Types */}
      <Tabs defaultValue="students" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="mt-4">
          {renderStudentsList()}
        </TabsContent>
        
        <TabsContent value="staff" className="mt-4">
          {renderStaffList()}
        </TabsContent>
        
        <TabsContent value="security" className="mt-4">
          {renderSecurityList()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersList;