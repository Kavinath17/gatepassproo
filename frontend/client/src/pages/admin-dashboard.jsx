import { useState } from "react";
import { Link } from "wouter";
import { Users, LogOut, UserPlus, School, Shield, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersList from "@/components/admin/users-list";
import AddStudentForm from "@/components/admin/add-student-form";
import AddStaffForm from "@/components/admin/add-staff-form";
import AddSecurityForm from "@/components/admin/add-security-form";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [addUserType, setAddUserType] = useState(null);

  const handleAddUser = (type) => {
    setAddUserType(type);
  };

  const handleCloseForm = () => {
    setAddUserType(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <School className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">College Gate Pass Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden sm:inline">Admin User</span>
            </div>
            <Link href="/">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <UserRound className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">253</div>
              <p className="text-xs text-slate-500 mt-1">
                +12 since last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-slate-500 mt-1">
                +3 since last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Security Personnel
              </CardTitle>
              <Shield className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-slate-500 mt-1">
                No change since last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-bold">User Management</h2>
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => handleAddUser("student")}
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Student</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => handleAddUser("staff")}
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Staff</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => handleAddUser("security")}
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Security</span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="users">All Users</TabsTrigger>
              <TabsTrigger value="gate_pass_reports">Gate Pass Reports</TabsTrigger>
              <TabsTrigger value="system_settings">System Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4">
              <UsersList />
            </TabsContent>
            
            <TabsContent value="gate_pass_reports">
              <div className="text-center py-20 text-slate-500">
                <p>Gate pass reporting module is under development.</p>
                <p className="text-sm mt-2">Coming soon!</p>
              </div>
            </TabsContent>
            
            <TabsContent value="system_settings">
              <div className="text-center py-20 text-slate-500">
                <p>System settings module is under development.</p>
                <p className="text-sm mt-2">Coming soon!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Forms */}
      {addUserType === "student" && <AddStudentForm onClose={handleCloseForm} />}
      {addUserType === "staff" && <AddStaffForm onClose={handleCloseForm} />}
      {addUserType === "security" && <AddSecurityForm onClose={handleCloseForm} />}
    </div>
  );
};

export default AdminDashboard;