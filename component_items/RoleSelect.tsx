// component_items/RoleSelect.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { X, User, Shield, Crown, Check } from "lucide-react";

type Role = "customer" | "admin" | "owner";

interface Option {
  value: Role;
  label: string;
  icon: React.ReactNode;
}

const options: Option[] = [
  { value: "customer", label: "Customer", icon: <User className="w-5 h-5" /> },
  { value: "admin", label: "Admin", icon: <Shield className="w-5 h-5" /> },
  { value: "owner", label: "Owner", icon: <Crown className="w-5 h-5" /> },
];

interface RoleSelectProps {
  value?: Role;
  onChange: (value: Role) => void;
  error?: string;
}

export function RoleSelect({ value, onChange, error }: RoleSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-gray-700 text-sm font-medium">Role</label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`mt-1.5 w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
          open ? "border-amber-400 ring-2 ring-amber-100" : "border-gray-300"
        } ${error ? "border-red-400" : ""}`}
      >
        <span
          className={`text-[16px] font-medium ${
            selected ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {selected ? selected.label : "Select a role"}
        </span>
        <span className="text-gray-500">
          {selected ? selected.icon : <User className="w-5 h-5" />}
        </span>
      </button>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute z-50 top-[calc(100%+8px)] left-0 w-full min-w-[280px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <span className="text-gray-800 text-[15px] font-semibold">
              Select a role
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Options */}
          <div className="flex flex-col">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-between gap-3 px-4 py-4 text-left transition-colors ${
                    isSelected ? "bg-amber-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700">{option.icon}</span>
                    <span className="text-gray-800 text-[15px] font-medium">
                      {option.label}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
