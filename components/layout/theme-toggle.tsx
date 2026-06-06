"use client";

import * as React from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-9 w-9 rounded-full border border-border-default/50 hover:bg-bg-elevated transition-colors duration-200"
          aria-label="Toggle theme"
        />
      }>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-border-default bg-bg-surface p-1 shadow-md">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-bg-alt dark:hover:bg-bg-subtle cursor-pointer ${
            theme === "light" ? "text-accent-primary font-medium bg-bg-alt dark:bg-bg-subtle" : "text-text-secondary"
          }`}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-bg-alt dark:hover:bg-bg-subtle cursor-pointer ${
            theme === "dark" ? "text-accent-primary font-medium bg-bg-alt dark:bg-bg-subtle" : "text-text-secondary"
          }`}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-bg-alt dark:hover:bg-bg-subtle cursor-pointer ${
            theme === "system" ? "text-accent-primary font-medium bg-bg-alt dark:bg-bg-subtle" : "text-text-secondary"
          }`}
        >
          <Laptop className="h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
