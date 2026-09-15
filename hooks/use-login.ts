// hooks/use-login.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { loginRequest, LoginPayload, AuthResponse } from "@/lib/api/auth";

interface ApiError {
  message: string;
}

export function useLogin() {
  const router = useRouter();

  return useMutation<AuthResponse, AxiosError<ApiError>, LoginPayload>({
    mutationFn: loginRequest,
    onSuccess: () => {
      router.push("/");
    },
  });
}
