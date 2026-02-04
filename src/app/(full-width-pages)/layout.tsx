import React, { Suspense } from "react";

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </div>
  );
}