// "use client";

// import { AppointmentDetails } from "@/section/whatsapp/appointmentDetails";

// export default AppointmentDetails;


"use client";

import React, { Suspense } from "react";
import { AppointmentDetails } from "@/section/whatsapp/appointmentDetails";
import { CircularProgress } from "@mui/material";

// This wrapper ensures the build doesn't fail due to useSearchParams()
export default function AppointmentPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        }>
            <AppointmentDetails />
        </Suspense>
    );
}
