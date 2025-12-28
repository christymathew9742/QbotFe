
// "use client";
// import React, { use, useEffect } from "react";
// import Badge from "../ui/badge/Badge";
// import { ArrowDownIcon, ArrowUpIcon, GroupIcon } from "@/icons";
// import MenuBookIcon from '@mui/icons-material/MenuBook';
// import { Skeleton } from "@mui/material";

// export const WhatsAppMetrics = ({ metrics }: any) => {
//   let Pending = metrics?.pendingStatus;

//   const percentageUser = metrics?.totalUniqueUsers
//     ? parseFloat(((metrics?.activeUserCount ?? 0) / metrics.totalUniqueUsers * 100).toFixed(1))
//     : 0;

//   const percentageTotalBookings = metrics?.totalBookings
//     ? parseFloat(((metrics.appointmentComplited ?? 0) / metrics.totalBookings * 100).toFixed(1))
//     : 0;

//   const metricItems = [
//     {
//       label: "WhatsApp Users",
//       value: metrics?.totalUniqueUsers,
//       percentage: percentageUser,
//       icon: <GroupIcon className="text-color-primary size-6 dark:text-white/90" />,
//     },
//     {
//       label: "All Bookings",
//       value: metrics?.totalBookings,
//       percentage: percentageTotalBookings,
//       icon: <MenuBookIcon className="!text-color-primary dark:!text-white/90" />,
//     },
//   ];

//   const renderOrSkeleton = (condition: boolean, skeletonClass: string, content: React.ReactNode) =>
//     condition ? (
//       <Skeleton animation="wave" className={`dark:!border-gray-700 dark:!bg-color-primary ${skeletonClass}`} />
//     ) : (
//       content
//     );

//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
//       {metricItems.map((item, idx) => (
//         <div
//           key={idx}
//           className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-color-primary dark:bg-white/[0.03] md:p-6"
//         >
//           {renderOrSkeleton (
//             Pending,
//             "!rounded-2xl !w-12 !h-20 !-mt-4",
//             <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-color-primary">
//               {item.icon}
//             </div>
//           )}

//           <div className="flex items-end justify-between mt-5">
//             <div>
//               {renderOrSkeleton (
//                 Pending,
//                 "!w-22 !h-4 mt-2 !mt-0",
//                 <span className="text-sm text-color-primary-light dark:text-color-primary-light">{item.label}</span>
//               )}

//               {renderOrSkeleton (
//                 Pending,
//                 "!w-12 !h-4 mt-2 !mt-0",
//                 <h4 className="mt-2 font-bold text-app-theme text-title-sm dark:text-white/90">
//                   {item.value}
//                 </h4>
//               )}
//             </div>

//             {renderOrSkeleton (
//               Pending,
//               "!w-12 !h-4 !-mt-4",
//               <Badge color={`${item.percentage > 10 ? "success" : "error"}`}>
//                 {item.percentage || 0}%{" "}
//                 {item.percentage < 10 ? (
//                   <ArrowDownIcon className="text-error-500" />
//                 ) : (
//                   <ArrowUpIcon />
//                 )}
//               </Badge>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };


"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { GroupIcon } from "@/icons";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Skeleton } from "@mui/material";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const WhatsAppMetrics = ({ metrics }: any) => {
  let Pending = metrics?.pendingStatus;

  const percentageUser = metrics?.totalUniqueUsers
    ? parseFloat(((metrics?.activeUserCount ?? 0) / metrics.totalUniqueUsers * 100).toFixed(1))
    : 0;

  const percentageTotalBookings = metrics?.totalBookings
    ? parseFloat(((metrics.appointmentComplited ?? 0) / metrics.totalBookings * 100).toFixed(1))
    : 0;

  const generateTrendData = (finalValue: number) => {
    if (!finalValue) return [0, 0, 0, 0, 0];
    return [
      Math.floor(finalValue * 0.6),
      Math.floor(finalValue * 0.75),
      Math.floor(finalValue * 0.65),
      Math.floor(finalValue * 0.85),
      Math.floor(finalValue * 0.8),
      Math.floor(finalValue * 0.95),
      finalValue
    ];
  };

  const metricItems = [
    {
      label: "Total Clients",
      value: metrics?.totalUniqueUsers || 0,
      percentage: percentageUser,
      icon: <GroupIcon className="text-color-primary size-6 dark:text-white/90" />,
      chartData: generateTrendData(metrics?.totalUniqueUsers || 0)
    },
    {
      label: "All Bookings",
      value: metrics?.totalBookings || 0,
      percentage: percentageTotalBookings,
      icon: <MenuBookIcon className="!text-color-primary dark:!text-white/90" />,
      chartData: generateTrendData(metrics?.totalBookings || 0)
    },
  ];

  const renderOrSkeleton = (condition: boolean, skeletonClass: string, content: React.ReactNode) =>
    condition ? (
      <Skeleton animation="wave" className={`dark:!border-gray-700 dark:!bg-color-primary ${skeletonClass}`} />
    ) : (
      content
    );
  const getChartOptions = (color: string): ApexOptions => ({
    chart: {
      type: "area",
      height: 100,
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: [color],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '12px',
      },
      x: { show: false },
      y: {
        formatter: function (val) {
          return val.toString();
        },
        title: {
          formatter: () => "Count: "
        }
      },
      marker: { show: true },
    },
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {metricItems.map((item, idx) => {
        const isPositive = item.percentage >= 35;
        const statusColor = isPositive ? "text-[#09BD3C]" : "text-[#ef4444cc]";
        const chartColor = isPositive ? "#FF7F50" : "#ef4444cc"; 
        
        return (
          <div
            key={idx}
            className="rounded-md bg-white p-5 shadow-xl backdrop-blur-sm dark:bg-white/[0.03] md:p-6 border border-transparent dark:border-gray-700"
          >
            <div className="flex items-center justify-between gap-6">
              <div className="flex flex-col justify-between h-full w-[30%]">
                {renderOrSkeleton(
                  Pending,
                  "!w-24 !h-4 !mb-6",
                  <h4 className="mb-3 whitespace-nowrap text-lg font-medium text-color-primary dark:text-gray-400">
                    {item.label}
                  </h4>
                )}

                <div className="flex items-center">
                  {renderOrSkeleton(
                    Pending,
                    "!w-18 !h-8 ",
                    <h2 className="text-3xl font-bold text-color-primary dark:text-white mb-0">
                      {item.value}
                    </h2>
                  )}

                  <div className="ms-4 flex items-center pl-3">
                    {renderOrSkeleton(
                      Pending,
                      "!w-2 !h-6",
                      <div className={`flex items-center font-bold text-sm ${statusColor}`}>
                        {isPositive ? (
                            <svg width="16" height="11" viewBox="0 0 21 11" fill="none" className="mr-1">
                                <path d="M1.49217 11C0.590508 11 0.149368 9.9006 0.800944 9.27736L9.80878 0.66117C10.1954 0.29136 10.8046 0.291359 11.1912 0.661169L20.1991 9.27736C20.8506 9.9006 20.4095 11 19.5078 11H1.49217Z" fill="currentColor"></path>
                            </svg>
                        ) : (
                            <svg width="16" height="11" viewBox="0 0 21 11" fill="none" className="mr-1 rotate-180">
                                <path d="M1.49217 11C0.590508 11 0.149368 9.9006 0.800944 9.27736L9.80878 0.66117C10.1954 0.29136 10.8046 0.291359 11.1912 0.661169L20.1991 9.27736C20.8506 9.9006 20.4095 11 19.5078 11H1.49217Z" fill="currentColor"></path>
                            </svg>
                        )}
                        <span>{isPositive ? "+" : ""}{item.percentage}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative h-full w-[70%] px-4">
                 {renderOrSkeleton(
                    Pending,
                    "!w-20 !h-2 !mt-20",
                    <ReactApexChart
                      options={getChartOptions(chartColor)}
                      series={[{ name: "Count", data: item.chartData }]}
                      type="area"
                      height={100}
                      width="100%"
                    />
                 )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};



