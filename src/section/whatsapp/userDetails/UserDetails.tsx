"use client";

import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { AppDispatch } from "@/redux/store";
import { getAllPending, getAppointmentSelector } from "@/redux/reducers/appointment/selectors";
import { fetchAppointmentRequest } from "@/redux/reducers/appointment/actions";
import { formatString, formatUpdatedDate } from "@/utils/utils";
import SentimentChartOne from "@/components/charts/sentimentScores/SentimentScores";

const UserDetails = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isFetching, setIsFetching] = useState(true);

    const searchParams = useSearchParams();
    const appointmentId = searchParams.get("userId");

    const appointmentData = useSelector(getAppointmentSelector);
    const pendingStatus = useSelector(getAllPending);

    useEffect(() => {
        setIsFetching(pendingStatus.fetch);
    }, [pendingStatus]);

    useEffect(() => {
        if (appointmentId) {
            dispatch(fetchAppointmentRequest(appointmentId));
        }
    }, [dispatch, appointmentId]);

    const infoItems = [
        { label: "User Name :", value: appointmentData?.data?.appointment?.profileName },
        { label: "Last appointment :", value: appointmentData?.data?.latestFlowTitle },
        { label: "Sentiment Score :", value: `${appointmentData?.data?.averageSentimentScores?.sentimentScores?.sentimentScore}/10` },
        { label: "Interaction Speed :", value: `${appointmentData?.data?.averageSentimentScores?.sentimentScores?.speedScore}/10` },
        { label: "Total Appointment :", value: appointmentData?.data?.totalAppointments || 0 },
        { label: "User Type :", value: appointmentData?.data?.userType },
        { label: "Behaviour Score :", value: `${appointmentData?.data?.averageSentimentScores?.sentimentScores?.behaviourScore}/10` },
        { label: "User Number :", value: appointmentData?.data?.appointment?.whatsAppNumber },
        { label: "Last Appointment Status :", value: formatString(appointmentData?.data?.latestStatus) },
        { label: "User Created :", value: formatUpdatedDate(appointmentData?.data?.appointment?.userCreated) },
        { label: "Last Visited :", value: formatUpdatedDate(appointmentData?.data?.appointment?.lastActiveAt) },
    ];

    return (
        <div className="h-auto">
            <PageBreadcrumb pagePath="user-details" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* User Details */}
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] w-full sm:w-[40%]">
                        <div className="h-full rounded-xl p-1">
                            <div className="px-4 py-2 w-full">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Details</h3>
                            </div>
                            {isFetching ? (
                                <div className="w-full flex justify-center border-t dark:border-gray-800 py-6">
                                    <CircularProgress />
                                </div>
                            ) : (
                                <div className="p-4 border-t dark:border-gray-800 sm:p-6 overflow-y-auto custom-scrollbar max-h-[350px]">
                                    <div className="border dark:border-gray-700 rounded-[4px]">
                                        {infoItems.map(({ label, value }, idx) => (
                                        <div
                                            key={label}
                                            className={`p-2 ${idx !== 0 ? "border-t dark:border-gray-700" : ""}`}
                                        >
                                            <p className="text-sm text-gray-400 mb-2 ml-2">{label}</p>
                                            <p className="text-base font-semibold text-gray-900 dark:text-white ml-2">
                                                {value ?? "-"}
                                            </p>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-2  px-4 py-2 border-t dark:border-gray-800 "></div>
                        </div>
                    </div>
                    {/* Activities */}
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] w-full sm:w-[60%]">
                        <div className="h-full rounded-xl p-1">
                            <div className="px-4 py-2">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Activities</h3>
                            </div>
                            {isFetching ? (
                                <div className="w-full flex justify-center border-t dark:border-gray-800 py-6">
                                    <CircularProgress />
                                </div>
                            ) : (
                                <div className="p-4 border-t dark:border-gray-800 sm:p-6 overflow-y-auto custom-scrollbar max-h-[350px] space-y-4">
                                    <SentimentChartOne appointments={appointmentData?.data?.sentimentData} />
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-2  px-4 py-2 border-t dark:border-gray-800 "></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
