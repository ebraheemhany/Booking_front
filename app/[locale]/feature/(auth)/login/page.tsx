"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  LoginFormValues,
} from "@/lib/validations/login_validation";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormInput } from "@/component_items/FormInput";

import { Socail_auth } from "@/component_items/socail_auth";
import Link from "next/link";
import { useLogin } from "@/hooks/use-login";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending, error } = useLogin();

  const onSubmit = async (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full">
        <Socail_auth />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex items-center justify-center"
      >
        <FieldGroup className="w-full flex flex-col items-center">
          <FormInput
            label="Your Email"
            type="email"
            placeholder=""
            autoComplete="email"
            {...register("email")}
            error={errors.email?.message}
          />

          <FormInput
            label="Your Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
            error={errors.password?.message}
          />

          <div className="w-full flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-primary border-b-2 border-b-amber-400 cursor-pointer text-gray-700"
            >
              <Link href="/feature/Forget_Password">Forgot password?</Link>
            </button>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-amber-500 rounded-lg py-5 cursor-pointer text-[18px] disabled:opacity-60"
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>

          <div className=" w-[85%] text-center">
            <p className="text-gray-500 text-[14px]">
              By continuing, you agree to our{" "}
              <span className="text-bold text-black border-b-1 border-yellow-400">
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span className="text-bold text-black border-b-1 border-yellow-400">
                Privacy Policy.
              </span>
            </p>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
