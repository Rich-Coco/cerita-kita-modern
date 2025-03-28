
import React from "react";
import { Coins as CoinsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoinsProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
}

const Coins = ({ 
  className,
  size = "default",
  ...props
}: CoinsProps) => {
  return (
    <CoinsIcon
      className={cn(
        "text-yellow-400",
        size === "sm" && "h-4 w-4",
        size === "default" && "h-5 w-5",
        size === "lg" && "h-6 w-6",
        className
      )}
      {...props}
    />
  );
};

export { Coins };
