"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  onValueChange?: (value: number) => void;
  className?: string;
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ value, max = 5, size = "md", readonly = false, onValueChange, className }, ref) => {
    const [hoverValue, setHoverValue] = React.useState(0);

    const sizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5"
    };

    const handleClick = (rating: number) => {
      if (!readonly && onValueChange) {
        onValueChange(rating);
      }
    };

    const handleMouseEnter = (rating: number) => {
      if (!readonly) {
        setHoverValue(rating);
      }
    };

    const handleMouseLeave = () => {
      if (!readonly) {
        setHoverValue(0);
      }
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-0.5", className)}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: max }, (_, i) => {
          const rating = i + 1;
          const isFilled = rating <= (hoverValue || value);

          return (
            <Star
              key={i}
              className={cn(
                sizeClasses[size],
                "transition-colors duration-150",
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200",
                !readonly && "cursor-pointer hover:scale-110 transition-transform"
              )}
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
            />
          );
        })}
      </div>
    );
  }
);

Rating.displayName = "Rating";

export { Rating };
