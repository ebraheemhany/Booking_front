// lib/api/auth.ts
import { api } from "./axios";

// login request
export interface AuthResponse {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginRequest = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/login", payload);
  return data;
};

// sign up request

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  role: string;
}

export const registerRequest = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/register", payload);
  return data;
};

// forget password

// step => 1
export interface ForgetPasswordPayload {
  email: string;
}

export interface ForgetPasswordResponse {
  message: string;
}

export const forgetPasswordRequest = async (
  payload: ForgetPasswordPayload,
): Promise<ForgetPasswordResponse> => {
  const { data } = await api.post<ForgetPasswordResponse>(
    "/otp/request",
    payload,
  );
  return data;
};

// step => 2
export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface VerifyOtpResponse {
  message: string;
  resetToken: string;
}

export const verifyOtpRequest = async (
  payload: VerifyOtpPayload,
): Promise<VerifyOtpResponse> => {
  const { data } = await api.post<VerifyOtpResponse>("/otp/verify", payload);
  return data;
};

// step => 3
export interface ResetPasswordPayload {
  resetToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export const resetPasswordRequest = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  const { data } = await api.post<ResetPasswordResponse>(
    "/otp/reset-password",
    payload,
  );
  return data;
};
