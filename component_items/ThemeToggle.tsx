"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Monitor, Sun, Moon } from "lucide-react";

const options = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">الوضع</span>

      <div className="flex items-center gap-1 rounded-full border border-border bg-muted/80 p-1 shadow-sm backdrop-blur-sm">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;

          return (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {isActive && <span>{option.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
