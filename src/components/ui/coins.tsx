
import React from "react";
import { Coins as CoinsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoinsProps {
  size?: "sm" | "default" | "lg";
  className?: string;
}

const Coins = ({ 
  className,
  size = "default",
}: CoinsProps) => {
  return (
    <CoinsIcon
      className={cn(
        "text-primary",
        size === "sm" && "h-4 w-4",
        size === "default" && "h-5 w-5",
        size === "lg" && "h-6 w-6",
        className
      )}
    />
  );
};

export { Coins };
