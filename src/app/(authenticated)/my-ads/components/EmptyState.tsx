"use client";

import Link from "next/link";
import { Home, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  actionLink?: string;
  actionHref?: string;
  actionOnClick?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionLink,
  actionHref,
  actionOnClick,
}: EmptyStateProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center px-6 py-12 max-w-md mx-auto">
        <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-5 flex items-center justify-center">
          <Home className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        {actionLink ? (
          <Link
            href={actionLink}
            className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-5 py-2.5 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={actionOnClick}
            className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-5 py-2.5 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
