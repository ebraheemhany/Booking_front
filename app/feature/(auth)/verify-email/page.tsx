// app/feature/(auth)/verify-email/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/component_items/OtpInput";

const RESEND_SECONDS = 60 * 5;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (otp.length !== 6) {
        setError("Please enter the 6-digit code");
        return;
      }

      try {
        setIsSubmitting(true);
        // استدعاء API التحقق من الـ OTP هنا
        // await api.post("/auth/verify-email", { email, otp });

        router.push("/feature/reset-password");
      } catch (err) {
        setError("Invalid or expired code. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [otp, email, router],
  );

  const handleResend = async () => {
    try {
      setIsResending(true);
      // استدعاء API إعادة إرسال الكود هنا
      // await api.post("/auth/resend-otp", { email });

      setCountdown(RESEND_SECONDS);
      setOtp("");
    } catch (err) {
      setError("Couldn't resend the code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full flex flex-col items-center gap-2 text-center">
        <h1 className="text-gray-800 text-[24px] font-bold">
          Verify your email
        </h1>
        <p className="text-gray-500 text-[15px]">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-gray-700">
            {email || "your email"}
          </span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-6"
      >
        <OtpInput value={otp} onChange={setOtp} error={error} />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-500 rounded-lg py-5 cursor-pointer text-[18px] disabled:opacity-60"
        >
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-sm text-gray-500">
          {countdown > 0 ? (
            <span>Resend code in {countdown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-medium text-gray-700 border-b-2 border-b-amber-400 cursor-pointer disabled:opacity-60"
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
