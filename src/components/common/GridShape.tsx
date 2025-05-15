import Image from "next/image";
import React from "react";

export default function GridShape() {
  return (
  <div className="relative w-full h-screen">
    <Image
      src="/images/login/log-bg.png"
      alt="grid"
      fill
      style={{ objectFit: 'cover', objectPosition: 'center' }}
    />
  </div>
  );
}
