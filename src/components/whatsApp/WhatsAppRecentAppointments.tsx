"use client";
import { AppointmentIcon } from "@/icons";
import React from "react";
import { Skeleton } from "@mui/material";

interface StatCardProps {
  appointmentStatus?: {
    todaysAppointments?: number;
    totalStatusCounts?: Record<string, number>;
    appointmentComplited?: number;
    todaysCancelledAppointments?: number;
    todaysCompletedAppointments?: number;
    totalAppointments?: number;
    totalCancelledAppointments?: number;
  };
  pendingStatus?: boolean;
}

interface StatCardItem {
  title: string;
  subtitle: string;
  total: number;
  today: number;
  theme: string;
}

const WhatsAppStatCard: React.FC<StatCardProps> = ({
  appointmentStatus,
  pendingStatus = false,
}) => {
  console.log(appointmentStatus,'appointmentStatus')
  const stats: StatCardItem[] = [
    {
      title: "Total Appointments",
      subtitle: "Today's Bookings",
      total: appointmentStatus?.totalAppointments ?? 0,
      today: appointmentStatus?.todaysAppointments ?? 0,
      theme: "bg-success-500/[0.08] text-color-primary",
    },
    {
      title: "Completed Appointments",
      subtitle: "Today's Completed",
      total: appointmentStatus?.appointmentComplited ?? 0,
      today: appointmentStatus?.todaysCompletedAppointments ?? 0,
      theme: "bg-blue-500/[0.08] text-blue-color-primary",
    },
    {
      title: "Cancelled Appointments",
      subtitle: "Today's Cancelled",
      total: appointmentStatus?.totalCancelledAppointments ?? 0,
      today: appointmentStatus?.todaysCancelledAppointments ?? 0,
      theme: "bg-red-500/[0.08] text-color-primary",
    },
  ];

  const renderOrSkeleton = (showSkeleton: boolean, className: string, content: React.ReactNode) =>
    showSkeleton ? (
      <Skeleton animation="wave" className={`${className} dark:!bg-color-primary`} />
    ) : (
      content
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className={`flex items-center justify-between rounded-md bg-white p-5 shadow-xl backdrop-blur-sm border border-gray-100 ${pendingStatus ? 'px-3' : 'p-4'} dark:border-color-primary dark:bg-white/[0.03]`}
        >
          <div className="flex items-center gap-4">
            {renderOrSkeleton(
              pendingStatus,
              "!rounded-2xl !w-12 !h-20",
              <div className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl ${item.theme}`}>
                <AppointmentIcon />
              </div>
            )}
            <div>
              {renderOrSkeleton(
                pendingStatus,
                "!w-28 !h-4",
                <h4 className="mb-1 text-sm font-medium text-color-primary dark:text-white/90">
                  {item.title}
                </h4>
              )}
              {renderOrSkeleton(
                pendingStatus,
                "!w-28 !h-4",
                <span className="block text-sm text-color-primary-light dark:text-color-primary-light">
                  {item.subtitle}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            {renderOrSkeleton(
              pendingStatus,
              "!w-10 !h-4",
              <span className="mb-1 block text-sm text-color-primary-light dark:text-color-primary-light">
                {item.total}
              </span>
            )}
            {renderOrSkeleton(
              pendingStatus,
              "!w-10 !h-4",
              <span className="block text-sm text-color-primary-light dark:text-color-primary-light">
                {item.today}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WhatsAppStatCard;
