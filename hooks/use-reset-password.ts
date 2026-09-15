// hooks/use-reset-password.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import {
  resetPasswordRequest,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "@/lib/api/auth";

interface ApiError {
  message: string;
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation<ResetPasswordResponse, AxiosError<ApiError>, ResetPasswordPayload>({
    mutationFn: resetPasswordRequest,
    onSuccess: () => {
      router.push("/feature/login?reset=success");
    },
  });
}