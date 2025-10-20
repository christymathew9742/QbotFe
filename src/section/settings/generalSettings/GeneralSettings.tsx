// "use client";

// import React from "react";

// const GeneralSettings = () => {
//     return (
//         <h1>General settings</h1>
//     )
// }

// export default GeneralSettings;


// components/LocationPickerInner.tsx

"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const LocationPickerInner = dynamic(() => import("./location"), {
  ssr: false,
});

export default function LocationPicker() {
  const handleSelect = (coords: { lat: number; lng: number; name?: string }) => {
    console.log("Array of selected locations:", coords);
    // send to DB here
  };

  return <LocationPickerInner onSelect={handleSelect} />;
}





