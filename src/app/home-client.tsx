"use client";

import { useEffect, useRef } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeIn({ children, delay = 0, className = "", direction = "up" }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("opacity-100", "translate-x-0", "translate-y-0");
              entry.target.classList.remove(
                "opacity-0", 
                "translate-y-8", 
                "-translate-y-8", 
                "translate-x-8", 
                "-translate-x-8"
              );
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  let initialTransform = "";
  switch (direction) {
    case "up":
      initialTransform = "translate-y-8";
      break;
    case "down":
      initialTransform = "-translate-y-8";
      break;
    case "left":
      initialTransform = "translate-x-8";
      break;
    case "right":
      initialTransform = "-translate-x-8";
      break;
    case "none":
      initialTransform = "";
      break;
  }

  return (
    <div 
      ref={ref} 
      className={`opacity-0 ${initialTransform} transition-all duration-1000 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
