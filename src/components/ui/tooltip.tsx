"use client";

import { ReactNode } from "react";

interface TooltipProps {
  text: string;
  position?: "left" | "right" | "top" | "bottom";
  children: ReactNode;
}

export default function Tooltip({
  text,
  position = "left",
  children,
}: TooltipProps) {
  const positionClasses = {
    left: "right-full mr-3 top-1/2 -translate-y-1/2",
    right: "left-full ml-3 top-1/2 -translate-y-1/2",
    top: "bottom-full mb-3 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-3 left-1/2 -translate-x-1/2",
  };

  const arrowClasses = {
    left: "absolute top-1/2 -translate-y-1/2 -right-2 w-0 h-0 border-8 border-transparent border-l-white",
    right:
      "absolute top-1/2 -translate-y-1/2 -left-2 w-0 h-0 border-8 border-transparent border-r-white",
    top: "absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-8 border-transparent border-t-white",
    bottom:
      "absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-8 border-transparent border-b-white",
  };

  return (
    <div className="relative group">
      {children}
      <div
        className={`absolute ${positionClasses[position]} z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform scale-95 group-hover:scale-100 pointer-events-none`}
      >
        <span className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap flex items-center justify-center border border-gray-100">
          {text}
          <span className={arrowClasses[position]}></span>
        </span>
      </div>
    </div>
  );
}
