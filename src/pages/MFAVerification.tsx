
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const MFAVerification = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle MFA code submission
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call for MFA verification
    setTimeout(() => {
      console.log("MFA code submitted:", value);
      toast.success("Verification successful!");
      setIsSubmitting(false);
      navigate("/dashboard");
    }, 1500);
  };

  // Handle resending the MFA code
  const handleResendCode = () => {
    toast.info("Verification code resent to your device");
    // Here you would trigger the code resend API
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/30 px-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Two-Factor Authentication</CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code sent to your registered device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={value} onChange={setValue}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || value.length !== 6}
            >
              {isSubmitting ? "Verifying..." : "Verify & Continue"}
            </Button>
            <div className="text-center">
              <Button type="button" variant="link" onClick={handleResendCode}>
                Didn't receive a code? Resend
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            onClick={() => navigate("/auth")}
            className="text-sm"
          >
            Use a different authentication method
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MFAVerification;
