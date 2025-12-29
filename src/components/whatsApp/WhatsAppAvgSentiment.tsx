"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface SentimentScore {
  behaviourScore: number;
  finalScore: number;
  sentimentScore: number;
  speedScore: number;
}

interface MonthlyTargetProps {
  globalAverageSentimentScores: SentimentScore[];
  pendingStatus?: boolean;
}

export default function WhatsAppAvgSentiment({
  globalAverageSentimentScores,
  pendingStatus,
}: MonthlyTargetProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const chartColor = isDarkMode ? "#465FFF" : "#493e81";
  const chartTextColor = isDarkMode ? "#FFFFFF" : "#493e81";

  const ArcSkeleton = () => (
    <svg
      width="260"
      height="180"
      viewBox="0 0 260 180"
      className="text-[#0000001c] dark:text-[#1f2937]"
    >
      <path
        d="M 40 140 A 90 90 0 0 1 220 140"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M 40 140 A 90 90 0 0 1 220 140"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray="283"
        strokeDashoffset="200"
        className="text-[#0000001c] dark:text-[#b69e9e05]"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="200;50;200"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );

  if (pendingStatus) {
    return (
      <div className="rounded-md border mt-5 border-gray-200 bg-white dark:border-color-primary dark:bg-white/[0.03] shadow-xl backdrop-blur-sm">
        <div className="px-5 pt-5 border-b border-gray-200 mt-1 rounded-b-md bg-white shadow-default pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
          <div className="flex justify-between">
            <Skeleton
              variant="text"
              width={180}
              height={28}
              className={`dark:!border-gray-700 dark:!bg-color-primary`}
              animation="wave"
            />
          </div>

          <div className="relative flex justify-center mt-5">
            <ArcSkeleton />
            <Skeleton
              variant="text"
              width={40}
              height={30}
              className={`dark:!border-gray-700 dark:!bg-color-primary !absolute !top-[98px]`}
              animation="wave"
            />
          </div>

          <Skeleton
            variant="text"
            width={"80%"}
            height={20}
            style={{ margin: "20px auto" }}
            className={`dark:!border-gray-700 dark:!bg-color-primary `}
            animation="wave"
          />
        </div>

        <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton
                variant="text"
                width={60}
                height={18}
                className={`dark:!border-gray-700 dark:!bg-color-primary`}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width={40}
                height={20}
                className={`dark:!border-gray-700 dark:!bg-color-primary`}
                animation="wave"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { sentimentScore, speedScore, behaviourScore } =
    globalAverageSentimentScores[0] || {};
  const avgFinalScore =
    (sentimentScore + speedScore + behaviourScore) / 3 || 0.0;
  const finalScorePercentage = parseFloat(
    ((avgFinalScore / 10) * 100).toFixed(1)
  );
  const series = [finalScorePercentage || 0.0];

  const options: ApexOptions = {
    colors: [chartColor],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      sparkline: { enabled: true },
      height: 300,
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "65%" },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "32px",
            fontWeight: "600",
            offsetY: -40,
            color: chartTextColor, 
            formatter: (val) => val + "%",
          },
        },
      },
    },
    fill: { type: "solid", colors: [chartColor] }, 
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  return (
    <div className="rounded-md! bg-gradient-to-b from-white to-[#493e8199] border mt-5 border-gray-200 dark:border-color-primary dark:bg-white/[0.03] shadow-xl backdrop-blur-sm">
      <div className="px-5 pt-5 bg bg-white shadow-default mt-1 rounded-b-md! pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-color-primary dark:text-white/90">
            Engagement Overview
          </h3>
        </div>
        <div className="relative flex justify-center items-center h-[165px] overflow-hidden">
          <ReactApexChart
            options={options}
            series={series}
            type="radialBar"
            height={300}
            color={'#493e81'}
          />
        </div>

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-color-primary-light sm:text-base">
          Today's Engagement Overview score of your WhatsApp users is{" "}
          <span className="color-primary dark:text-white">{avgFinalScore.toFixed(1)}</span>. Keep
          up the great engagement!
        </p>
      </div>
      <div className="flex items-center justify-center gap-5 px-6 py-3.5 rounded-b-md sm:gap-8 sm:py-5 text-white">
        <div>
          <p className="mb-1 text-center dark:text-color-primary-light sm:text-sm">
            Behaviour
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold dark:text-white/90 sm:text-lg">
            {behaviourScore || 0.0}
          </p>
        </div>

        <div className="w-[.5px] bg-white h-7 dark:bg-color-primary"></div>

        <div>
          <p className="mb-1 text-center dark:text-color-primary-light sm:text-sm">
            Sentiment
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold dark:text-white/90 sm:text-lg">
            {sentimentScore || 0.0}
          </p>
        </div>

        <div className="w-[.5px] bg-white h-7 dark:bg-color-primary"></div>

        <div>
          <p className="mb-1 text-center dark:text-color-primary-light sm:text-sm">
            Interaction
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold dark:text-white/90 sm:text-lg">
            {speedScore || 0.0}
          </p>
        </div>
      </div>
    </div>
  );
}


