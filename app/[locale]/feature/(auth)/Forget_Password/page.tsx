"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgetPasswordSchema,
  ForgetPasswordFormValues,
} from "@/lib/validations/forget_password_validation";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/component_items/FormInput";
import Link from "next/link";
import { useForgetPassword } from "@/hooks/use-forget-password";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordFormValues>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const { mutate: sendOtp, isPending, error } = useForgetPassword();
  // const onSubmit = async (data: ForgetPasswordFormValues) => {
  //   try {
  //     setServerError("");
  //     sendOtp(data);
  //     router.push(
  //       `/feature/verify-email?email=${encodeURIComponent(data.email)}`,
  //     );
  //   } catch (err) {
  //     setServerError("Something went wrong. Please try again.");
  //   }
  // };
  const onSubmit = (data: ForgetPasswordFormValues) => {
    sendOtp(data);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full flex flex-col items-center gap-2 text-center">
        <h1 className="text-gray-800 text-[24px] font-bold">
          Forgot your password?
        </h1>
        <p className="text-gray-500 text-[15px]">
          No worries, enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex items-center justify-center"
      >
        <FieldGroup className="w-full flex flex-col items-center gap-4">
          <FormInput
            label="Your Email"
            type="email"
            placeholder=""
            autoComplete="email"
            {...register("email")}
            error={errors.email?.message}
          />

          {serverError && (
            <p className="w-full text-sm text-red-500 text-start">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-amber-500 rounded-lg py-5 cursor-pointer text-[18px] disabled:opacity-60"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </Button>

          <Link
            href="/feature/login"
            className="text-sm font-medium text-gray-700 border-b-2 border-b-amber-400 cursor-pointer"
          >
            Back to Login
          </Link>
        </FieldGroup>
      </form>
    </div>
  );
}
