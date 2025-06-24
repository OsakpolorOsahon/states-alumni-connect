
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(formData.emailOrUsername, formData.password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Try demo@smmowcub.org/demo or secretary@smmowcub.org/secretary");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4 flex-grow">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground">
                Member Login
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Access your SMMOWCUB account
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Demo Credentials Info */}
                <Alert>
                  <AlertDescription>
                    <strong>Demo credentials:</strong><br />
                    Member: demo@smmowcub.org / demo<br />
                    Secretary: secretary@smmowcub.org / secretary
                  </AlertDescription>
                </Alert>

                {/* Email or Username */}
                <div className="space-y-2">
                  <Label htmlFor="emailOrUsername" className="text-sm font-medium">
                    Email or Username
                  </Label>
                  <Input
                    id="emailOrUsername"
                    type="text"
                    placeholder="Enter your email or username"
                    required
                    value={formData.emailOrUsername}
                    onChange={(e) => setFormData(prev => ({ ...prev, emailOrUsername: e.target.value }))}
                    className="focus:ring-red-300 focus:border-red-300"
                    aria-describedby={error ? "login-error" : undefined}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="focus:ring-red-300 focus:border-red-300"
                    aria-describedby={error ? "login-error" : undefined}
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-[#E10600] hover:bg-[#C10500] text-white"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>

                {/* Forgot Password Link */}
                <div className="text-center">
                  <a 
                    href="/forgot-password" 
                    className="text-sm text-[#E10600] hover:underline font-medium"
                  >
                    Forgot Password?
                  </a>
                </div>

                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-[#E10600] hover:underline font-medium">
                      Sign up here
                    </a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
