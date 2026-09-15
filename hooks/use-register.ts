// hooks/use-register.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { registerRequest, RegisterPayload, AuthResponse } from "@/lib/api/auth";

interface ApiError {
  message: string;
}

export function useRegister() {
  const router = useRouter();

  return useMutation<AuthResponse, AxiosError<ApiError>, RegisterPayload>({
    mutationFn: registerRequest,
    onSuccess: () => {
      router.push("/feature/login");
    },
  });
}