
"use client";
import React, { use, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, GroupIcon } from "@/icons";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Skeleton } from "@mui/material";

export const WhatsAppMetrics = ({ metrics }: any) => {
  let Pending = metrics?.pendingStatus;

  const percentageUser = metrics?.totalUniqueUsers
    ? parseFloat(((metrics?.activeUserCount ?? 0) / metrics.totalUniqueUsers * 100).toFixed(1))
    : 0;

  const percentageTotalBookings = metrics?.totalBookings
    ? parseFloat(((metrics.appointmentComplited ?? 0) / metrics.totalBookings * 100).toFixed(1))
    : 0;

  const metricItems = [
    {
      label: "WhatsApp Users",
      value: metrics?.totalUniqueUsers,
      percentage: percentageUser,
      icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
    },
    {
      label: "All Bookings",
      value: metrics?.totalBookings,
      percentage: percentageTotalBookings,
      icon: <MenuBookIcon className="!text-gray-800 dark:!text-white/90" />,
    },
  ];

  const renderOrSkeleton = (condition: boolean, skeletonClass: string, content: React.ReactNode) =>
    condition ? (
      <Skeleton animation="wave" className={`dark:!border-gray-700 dark:!bg-gray-800 ${skeletonClass}`} />
    ) : (
      content
    );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {metricItems.map((item, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          {renderOrSkeleton (
            Pending,
            "!rounded-2xl !w-12 !h-20 !-mt-4",
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {item.icon}
            </div>
          )}

          <div className="flex items-end justify-between mt-5">
            <div>
              {renderOrSkeleton (
                Pending,
                "!w-22 !h-4 mt-2 !mt-0",
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
              )}

              {renderOrSkeleton (
                Pending,
                "!w-12 !h-4 mt-2 !mt-0",
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {item.value}
                </h4>
              )}
            </div>

            {renderOrSkeleton (
              Pending,
              "!w-12 !h-4 !-mt-4",
              <Badge color={`${item.percentage > 10 ? "success" : "error"}`}>
                {item.percentage || 0}%{" "}
                {item.percentage < 10 ? (
                  <ArrowDownIcon className="text-error-500" />
                ) : (
                  <ArrowUpIcon />
                )}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};



