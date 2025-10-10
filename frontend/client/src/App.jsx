import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import CollegeLogo from "./components/ui/college-logo";

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const StudentDashboard = lazy(() => import("./pages/student-dashboard"));
const StudentCreateProfile = lazy(() =>
  import("./pages/student-profile-create")
);
const StudentRegister = lazy(() => import("./pages/student-register"));
const SecurityDashboard = lazy(() => import("./pages/security-dashboard"));
const SecurityLogin = lazy(() => import("./pages/security-login"));
const StaffDashboard = lazy(() => import("./pages/staff-dashboard"));
const StaffRegister = lazy(() => import("./pages/staff-register"));
const StaffLogin = lazy(() => import("./pages/staff-login"));

const WardenDashboard = lazy(() => import("./pages/warden-dashboard"));

const AdminDashboard = lazy(() => import("./pages/admin-dashboard"));
const StudentProfile = lazy(() => import("./pages/student-profile"));
const SecurityProfile = lazy(() => import("./pages/security-profile"));
const SecurityRegister = lazy(() => import("./pages/security-register"));
const StaffProfile = lazy(() => import("./pages/staff-profile"));
const NotFound = lazy(() => import("./pages/not-found"));

function WelcomeScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[url(./ShanmughaImages-02.jpg)] bg-cover bg-center from-primary/5 to-primary/10 p-4">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-50"></div>
      <div className="max-w-md w-full bg-white rounded-lg  shadow-xl overflow-hidden realtive z-10">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CollegeLogo size="lg" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              College Gate Pass System
            </h1>
            <p className="text-slate-600">
              Please select your role to continue
            </p>
          </div>

          <div className="grid gap-4">
            <a
              href="/login"
              className="block text-center px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              Student Login
            </a>
            <a
              href="/student-register"
              className="block text-center px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              Student Register
            </a>
            <a
              href="/staff-login"
              className="block text-center px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              Staff Login
            </a>
            <a
              href="/staff-register"
              className="block text-center px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              Staff Register
            </a>
            <a
              href="/security-login"
              className="block text-center px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              Security Login
            </a>
            <a
              href="/security-register"
              className="block text-center px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              Security Register
            </a>

            {/* <div className="mt-4">
              <a
                href="/login"
                className="w-full block text-center px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-md text-slate-700 text-sm transition-colors"
              >
                Login with existing account
              </a>
            </div> */}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-slate-500 text-sm">
        <p>SSCET © 2025 College Gate Pass System</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className="flex h-screen w-screen items-center justify-center">
            Loading...
          </div>
        }
      >
        <Switch>
          <Route path="/" component={WelcomeScreen} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/student-register" component={StudentRegister} />
          <Route
            path="/student-create-profile"
            component={StudentCreateProfile}
          />
          <Route path="/student-dashboard" component={StudentDashboard} />
          <Route path="/student-profile" component={StudentProfile} />

          <Route path="/security-dashboard" component={SecurityDashboard} />
          <Route path="/security-profile" component={SecurityProfile} />
          <Route path="/security-register" component={SecurityRegister} />
          <Route path="/security-login" component={SecurityLogin} />

          <Route path="/staff-dashboard" component={StaffDashboard} />
          <Route path="/staff-register" component={StaffRegister} />
          <Route path="/staff-login" component={StaffLogin} />
          <Route path="/staff-profile" component={StaffProfile} />

          <Route path="/warden-dashboard" component={WardenDashboard} />
          {/* <Route path="/staff-register" component={StaffRegister} />
          <Route path="/staff-login" component={StaffLogin} />
          <Route path="/staff-profile" component={StaffProfile} /> */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
