"use client";

import { forwardRef, useState, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    { label, name, type, error, placeholder, autoComplete, required, ...rest },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className="w-full">
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
        </label>

        <div className="relative">
          <input
            id={name}
            name={name}
            type={inputType}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            ref={ref}
            {...rest}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none focus:border-amber-500"
          />

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>

        {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
