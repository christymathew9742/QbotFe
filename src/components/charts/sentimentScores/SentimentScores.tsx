"use client";
import React, { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { formatString } from "@/utils/utils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

type SentimentScores = {
    behaviourScore: number;
    sentimentScore: number;
    speedScore: number;
};

type Appointment = {
    sentimentScores: SentimentScores;
    status: string;
    rescheduleCount: number
    
};

interface LineChartOneProps {
    appointments?: Appointment[];
}

export default function SentimentChartOne({ appointments = [] }: LineChartOneProps) {
    const series = useMemo (
        () => [
            {
                name: "Behaviour Score",
                data: appointments.map((a) => a.sentimentScores.behaviourScore ?? 0),
            },
            {
                name: "Sentiment Score",
                data: appointments.map((a) => a.sentimentScores.sentimentScore ?? 0),
            },
            {
                name: "Interaction Speed",
                data: appointments.map((a) => a.sentimentScores.speedScore ?? 0),
            },
        ],
        [appointments]
    );

    const categories = useMemo(
        () => appointments.map(a => formatString(a?.status + ((a?.rescheduleCount) ?? ""))),
        [appointments]
    );

    const options: ApexOptions = {
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "left",
        },
        colors: ["#465FFF", "#9CB9FF", "#FF7F50"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 310,
            type: "line",
            toolbar: { show: false },
        },
        stroke: {
            curve: "straight",
            width: [2, 2, 2],
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 0,
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 6,
            },
        },
        grid: {
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
        },
        dataLabels: { enabled: false },
        tooltip: {
            enabled: true,
            x: {
                formatter: (val) => String(val),
            },
        },
        xaxis: {
            categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false },
            title: { text: "Booking >" },
              labels: {
                style: {
                fontSize: "12px",
                colors: ["#493e81"],
                },
            },
        },
        yaxis: {
            min: 0,
            max: 10,
            tickAmount: 5,
            labels: {
                style: {
                fontSize: "12px",
                colors: ["#493e81"],
                },
            },
            title: {
                text: "Score (out of 10) >",
                style: { fontSize: "12px" },
            },
        },
    };

    return (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
            <div id="chartAppointments" className="min-w-[600px]">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="area"
                    height={280}
                />
            </div>
        </div>
    );
}

