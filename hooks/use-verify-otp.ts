// hooks/use-verify-otp.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { verifyOtpRequest, VerifyOtpPayload, VerifyOtpResponse } from "@/lib/api/auth";

interface ApiError {
  message: string;
}

export function useVerifyOtp() {
  const router = useRouter();

  return useMutation<VerifyOtpResponse, AxiosError<ApiError>, VerifyOtpPayload>({
    mutationFn: verifyOtpRequest,
    onSuccess: () => {
      router.push("/feature/reset-password");
    },
  });
}