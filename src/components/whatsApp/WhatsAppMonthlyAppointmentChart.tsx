"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Skeleton, Box } from "@mui/material";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

interface MonthlyAppointment {
  month: number;
  count: number;
}

interface WhatsAppMonthlySalesChartProps {
  monthlyAppointments: MonthlyAppointment[];
  pendingStatus?: boolean;
}

export default function WhatsAppMonthlyAppointmentChart({
  monthlyAppointments,
  pendingStatus = true,
}: WhatsAppMonthlySalesChartProps) {
  const seriesData = monthlyAppointments.map(item => item.count);
  const categories = monthlyAppointments.map(item => monthNames[item.month - 1]);
  const maxValue = Math.max(...seriesData, 10);
  const seriesPercent = seriesData.map(val => (val / maxValue) * 100);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 200,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: { formatter: (val: number) => `${val}%` },
    },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (val: number, { dataPointIndex }) => {
          const count = seriesData[dataPointIndex];
          return `Appointments:  ${count}(${val}%)`;
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
  };

  const series = [{ name: "", data: seriesPercent }];

  // Fixed skeleton bar heights
  const fixedSkeletonHeights = [60, 90, 120, 80, 150, 100, 130, 70, 110, 95, 140, 85];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 !min-h-[200px]">
      <div className="flex items-center justify-between">
        {pendingStatus ? (
          <Skeleton
            animation="wave"
            variant="text"
            width={180}
            height={28}
            className="dark:!border-gray-700 dark:!bg-gray-800"
          />
        ) : (
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Appointments
          </h3>
        )}
      </div>

      {pendingStatus ? (
        <Box sx={{ display: "flex", flexDirection: "column", height: 180, mt: 2 }}>
          <Box sx={{ display: "flex", flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                mr: 1,
                minWidth: 25,
              }}
            >
              {[100, 80, 60, 40, 20, 0].map((_, i) => (
                <Skeleton
                  key={i}
                  animation="wave"
                  variant="text"
                  width={25}
                  height={15}
                  sx={{ display: "block" }}
                  className="dark:!border-gray-700 dark:!bg-gray-800"
                />
              ))}
            </Box>

            {/* Bars skeleton */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              {fixedSkeletonHeights.map((h, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width={17}
                  height={h}
                  animation="wave"
                  sx={{
                    borderRadius: 1,
                    display: "block",
                    boxSizing: "border-box",
                  }}
                  className="dark:!border-gray-700 dark:!bg-gray-800"
                />
              ))}
            </Box>
          </Box>

          {/* X-axis month labels skeleton */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
              ml: 3,
            }}
          >
            {monthNames.map((_, i) => (
              <Skeleton
                key={i}
                animation="wave"
                variant="text"
                width={20}
                height={15}
                sx={{ display: "block" }}
                className="dark:!border-gray-700 dark:!bg-gray-800"
              />
            ))}
          </Box>
        </Box>
      ) : (
        <div
          className="max-w-full overflow-x-auto custom-scrollbar"
          style={{ height: 200, minHeight: 200, overflowY: "hidden" }}
        >
          <div className="-ml-5 min-w-[650px] sx:min-w-full pl-2">
            <ReactApexChart options={options} series={series} type="bar" height={200} />
          </div>
        </div>
      )}
    </div>
  );
}


