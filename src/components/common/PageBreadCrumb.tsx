"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface BreadcrumbProps {
  pagePath?: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pagePath = "" }) => {
  const pathname = usePathname();
  const paths = pagePath.split(",").map((p) => p.trim()).filter(Boolean);
  const pathLinks = paths.map((_, index) => {
    const href =
      "/" +
      paths
        .slice(0, index + 1)
        .map((p) => p.toLowerCase().replace(/\s+/g, "-"))
        .join("/");
    return href;
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <nav>
        <ol className="flex items-center gap-1.1 text-sm">
          <li>
            <Link
              href="/"
              className="inline-flex items-center gap-1.1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          {paths.map((label, index) => {
            const isLast = index === paths.length - 1;
            const href = pathLinks[index];
            const isActive = pathname === href;

            return (
              <li key={index} className="flex items-center gap-1.1">
                {!isLast ? (
                  <Link
                    href={href}
                    className={`inline-flex items-center gap-1.1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200`}
                  >
                    {label}
                    <svg
                      className="stroke-current"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                ) : (
                  <span
                    className={`font-semibold ${
                      isActive
                        ? "text-gray-500"
                        : "text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;

