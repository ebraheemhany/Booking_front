// app/feature/(auth)/verify-email/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/component_items/OtpInput";
import { useVerifyOtp } from "@/hooks/use-verify-otp";

const RESEND_SECONDS = 60 * 5;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [isResending, setIsResending] = useState(false);

  const { mutate: verifyOtp, isPending, error } = useVerifyOtp();

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    verifyOtp(
      { email, code: otp },
      {
        onSuccess: (data) => {
          router.push(
            `/feature/reset-password?token=${encodeURIComponent(data.resetToken)}`,
          );
        },
      },
    );
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      // استدعاء API إعادة إرسال الكود هنا
      setCountdown(RESEND_SECONDS);
      setOtp("");
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
        <OtpInput
          value={otp}
          onChange={setOtp}
          error={error?.response?.data?.message}
        />

        <Button
          type="submit"
          disabled={isPending || otp.length !== 6}
          className="w-full bg-amber-500 rounded-lg py-5 cursor-pointer text-[18px] disabled:opacity-60"
        >
          {isPending ? "Verifying..." : "Verify Code"}
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
