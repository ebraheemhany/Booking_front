// app/feature/(auth)/reset-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "@/lib/validations/reset_password_validation";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/component_items/FormInput";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password") || "";

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setServerError("");
      // استدعاء API تغيير كلمة السر هنا
      // await api.post("/auth/reset-password", { password: data.password });

      router.push("/feature/login?reset=success");
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full flex flex-col items-center gap-2 text-center">
        <h1 className="text-gray-800 text-[24px] font-bold">
          Set a new password
        </h1>
        <p className="text-gray-500 text-[15px]">
          Your new password must be different from previous passwords.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex items-center justify-center"
      >
        <FieldGroup className="w-full flex flex-col items-center gap-4">
          <FormInput
            label="New Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("password")}
            error={errors.password?.message}
          />

          <PasswordStrengthHint password={password} />

          <FormInput
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          {serverError && (
            <p className="w-full text-sm text-red-500 text-start">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 rounded-lg py-5 cursor-pointer text-[18px] disabled:opacity-60"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}

function PasswordStrengthHint({ password }: { password: string }) {
  const rules = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
  ];

  return (
    <ul className="w-full flex flex-col gap-1 -mt-2">
      {rules.map((rule) => (
        <li
          key={rule.label}
          className={`text-[13px] flex items-center gap-1.5 transition-colors ${
            rule.valid ? "text-green-600" : "text-gray-400"
          }`}
        >
          <span>{rule.valid ? "✓" : "○"}</span>
          {rule.label}
        </li>
      ))}
    </ul>
  );
}
