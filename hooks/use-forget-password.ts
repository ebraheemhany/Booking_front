// hooks/use-forget-password.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import {
  forgetPasswordRequest,
  ForgetPasswordPayload,
  ForgetPasswordResponse,
} from "@/lib/api/auth";

interface ApiError {
  message: string;
}

export function useForgetPassword() {
  const router = useRouter();

  return useMutation<
    ForgetPasswordResponse,
    AxiosError<ApiError>,
    ForgetPasswordPayload
  >({
    mutationFn: forgetPasswordRequest,
    onSuccess: (_data, variables) => {
      router.push(
        `/feature/verify-email?email=${encodeURIComponent(variables.email)}`,
      );
    },
  });
}
