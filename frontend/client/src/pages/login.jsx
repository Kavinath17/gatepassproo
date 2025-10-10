import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CollegeLogo from "@/components/ui/college-logo";
import { useToast } from "@/hooks/use-toast";
import { config } from "../lib/config";
const Login = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate login API call
      const req = await fetch(`${config.env.SERVER_URL}/api/students/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const res = await req.json();

      // Demo login logic - in a real app, this would verify with a backend
      if (res.message === "Login successful") {
        const token = res.token;

        localStorage.setItem("sessionToken", token);

        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
        });

        navigate("/student-dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Please enter valid credentials",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login error",
        description: error.message || "Failed to login. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[url(./ShanmughaImages-02.jpg)] bg-cover bg-center  from-primary/5 to-primary/10 p-4">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-50"></div>
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden realtive z-10">
        <div className="text-center pt-8">
          <div className="flex justify-center mb-4">
            <CollegeLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-primary">
            College Gate Pass System
          </h1>
          <p className="text-slate-600 mt-1">Login to your account</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student-email">Email</Label>
              <Input
                id="student-email"
                type="email"
                placeholder="example@shanmugha.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="student-password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="student-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link href="/register">
                <a className="text-primary hover:underline">Register now</a>
              </Link>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
