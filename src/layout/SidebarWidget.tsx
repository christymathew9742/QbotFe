import React from "react";

export default function SidebarWidget() {
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <h3 className="mb-2 font-semibold color-primary dark:text-white">
        #1 Tailwind CSS Dashboard
      </h3>
      <p className="mb-4 text-color-primary-light dark:text-color-primary-light">
        Leading Tailwind CSS Admin Template with 400+ UI Component and Pages.
      </p>
      <a
        href="https://tailadmin.com/pricing"
        target="_blank"
        rel="nofollow"
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-color-primary-light hover:bg-brand-600"
      >
        Upgrade To Pro
      </a>
    </div>
  );
}
