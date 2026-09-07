"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return <div className="h-8 w-16 rounded-full border border-border bg-muted" />
  }

  const isDark = resolvedTheme === "dark" || theme === "dark"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-8 w-16 cursor-pointer items-center rounded-full border border-border bg-muted p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div
        className={cn(
          "absolute left-1 h-6 w-6 rounded-full bg-background shadow-sm transition-transform duration-300 ease-in-out",
          isDark ? "translate-x-8" : "translate-x-0"
        )}
      />
      <div className="relative z-10 flex w-full justify-between px-[0.15rem]">
        <Sun
          className={cn(
            "h-4 w-4 transition-colors duration-300",
            !isDark ? "text-foreground" : "text-muted-foreground"
          )}
        />
        <Moon
          className={cn(
            "h-4 w-4 transition-colors duration-300",
            isDark ? "text-foreground" : "text-muted-foreground"
          )}
        />
      </div>
      <span className="sr-only">Ganti tema</span>
    </button>
  )
}