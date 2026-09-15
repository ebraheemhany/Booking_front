"use client";

import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { FormInput } from "@/component_items/FormInput";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterFormValues,
} from "@/lib/validations/register_validation";
import { Socail_auth } from "@/component_items/socail_auth";
import { useRegister } from "@/hooks/use-register";
import { RoleSelect } from "@/component_items/RoleSelect";
export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: signUp, isPending, error } = useRegister();

  const onSubmit = async (data: RegisterFormValues) => {
    signUp(data);
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-lg px-4">
        <div>
          <Socail_auth />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" w-full flex items-center justify-center mt-6"
        >
          <FieldGroup className=" flex flex-col  items-center ">
            <div className="w-full flex items-center justify-between gap-3">
              <FormInput
                label="First Name"
                type="text"
                placeholder=""
                {...register("first_name")}
                error={errors.first_name?.message}
              />
              <FormInput
                label="Last Name"
                type="text"
                placeholder=""
                {...register("last_name")}
                error={errors.last_name?.message}
              />
            </div>

            <FormInput
              label="Your Email"
              type="email"
              placeholder=""
              autoComplete="email"
              {...register("email")}
              error={errors.email?.message}
            />

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RoleSelect
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.role?.message}
                />
              )}
            />

            <FormInput
              label="Your Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("password")}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-amber-500 rounded-lg py-5 cursor-pointer text-[18px] disabled:opacity-60"
            >
              {isPending ? "Signing up..." : "Sign Up"}
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
    </main>
  );
}
