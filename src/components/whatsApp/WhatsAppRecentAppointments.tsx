"use client";
import { AppointmentIcon } from "@/icons";
import React from "react";
import { Skeleton } from "@mui/material";

interface StatCardProps {
  appointmentStatus?: {
    todaysAppointments?: number;
    totalStatusCounts?: Record<string, number>;
    totalBookings?: number;
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
      theme: "bg-success-500/[0.08] text-success-500",
    },
    {
      title: "Completed Appointments",
      subtitle: "Today's Completed",
      total: appointmentStatus?.totalStatusCounts?.completed ?? 0,
      today: appointmentStatus?.todaysCompletedAppointments ?? 0,
      theme: "bg-blue-500/[0.08] text-blue-light-500",
    },
    {
      title: "Cancelled Appointments",
      subtitle: "Today's Cancelled",
      total: appointmentStatus?.totalCancelledAppointments ?? 0,
      today: appointmentStatus?.todaysCancelledAppointments ?? 0,
      theme: "bg-red-500/[0.08] text-red-500",
    },
  ];

  const renderOrSkeleton = (showSkeleton: boolean, className: string, content: React.ReactNode) =>
    showSkeleton ? (
      <Skeleton animation="wave" className={`${className} dark:!bg-gray-800`} />
    ) : (
      content
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className={`flex items-center justify-between rounded-2xl border border-gray-100 bg-white ${pendingStatus ? 'px-3' : 'p-4'} dark:border-gray-800 dark:bg-white/[0.03]`}
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
                "!w-10 !h-4",
                <h4 className="mb-1 text-sm font-medium text-gray-800 dark:text-white/90">
                  {item.title}
                </h4>
              )}
              {renderOrSkeleton(
                pendingStatus,
                "!w-10 !h-4",
                <span className="block text-sm text-gray-500 dark:text-gray-400">
                  {item.subtitle}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            {renderOrSkeleton(
              pendingStatus,
              "!w-10 !h-4",
              <span className="mb-1 block text-sm text-gray-500 dark:text-gray-400">
                {item.total}
              </span>
            )}
            {renderOrSkeleton(
              pendingStatus,
              "!w-10 !h-4",
              <span className="block text-sm text-gray-500 dark:text-gray-400">
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
