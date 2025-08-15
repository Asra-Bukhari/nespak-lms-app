import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/branding/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Password validation: at least 8 chars, letters + numbers
  const validatePassword = (pwd: string) => {
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return pattern.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check password before submitting
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long and include both letters and numbers");
      return;
    } else {
      setPasswordError("");
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup-request`, {
        name,
        email,
        password
      });
      toast({ title: "Code sent", description: res.data.message });
      setShowCodeDialog(true);
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err.response?.data?.message || "Something went wrong.",
        variant: "destructive",
        style: {
    backgroundColor: "white",
    color: "black",          
  },
      });
    }
  };

  const handleVerify = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-code`, {
        email,
        code
      });
      toast({ title: "Verified", description: res.data.message });
      setVerified(true);
    } catch (err: any) {
      toast({
        title: "Invalid code",
        description: err.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/resend-code`, { email });
      toast({ title: "Code resent", description: "Check your email for the new code." });
    } catch {
      toast({ title: "Error", description: "Could not resend code.", variant: "destructive" });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/uploads/nespakBuilding.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-background/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="font-brand text-2xl text-primary">
              Join NESPAK
            </CardTitle>
            <p className="text-muted-foreground">
              Create your account to access professional development programs
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!validatePassword(e.target.value)) {
                      setPasswordError("Password must be at least 8 characters long and include both letters and numbers");
                    } else {
                      setPasswordError("");
                    }
                  }}
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              <Button type="submit" className="w-full" variant="hero">
                Create Account
              </Button>
           
    <div className="text-center text-sm text-muted-foreground">
      Already have an account?{" "}
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="text-primary hover:underline font-medium"
      >
        Login here
      </button>
    </div>
  </form>
</CardContent>
        </Card>
      </main>

      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Verification</DialogTitle>
          </DialogHeader>
          {!verified ? (
            <div className="space-y-4">
              <p>
                We’ve sent a verification code to <strong>{email}</strong>. Please enter it below:
              </p>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
              />
              <div className="flex gap-2">
                <Button onClick={handleVerify}>Verify</Button>
                <Button variant="secondary" onClick={handleResend}>Resend Code</Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-500 text-5xl">✅</div>
              <p>Email verified successfully!</p>
              <Button onClick={() => navigate("/login")}>Go to Login</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Signup;
