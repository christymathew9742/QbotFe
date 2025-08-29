"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useAlert } from "@/components/alert/alert";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { AppDispatch } from "@/redux/store";
import { formatString, formatUpdatedDate } from "@/utils/utils";
import SentimentChartOne from "@/components/charts/sentimentScores/SentimentScores";
import { fetchWhatsAppUserRequest } from "@/redux/reducers/user/actions";
import { getWhatsAppUserSelector, getAllPending } from "@/redux/reducers/user/selectors";

const UserDetails: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    const { renderAlert } = useAlert();

    const userId = useMemo(() => searchParams.get("userId"), [searchParams]);
    const pendingStatus = useSelector(getAllPending);
    const userData = useSelector(getWhatsAppUserSelector);

    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<any>(null);

    const fetchUserDetails = useCallback(() => {
        if (!userId) {
            setError("Invalid user ID.");
            setIsFetching(false);
            return;
        }
            setIsFetching(true);
            setError(null);
            dispatch(fetchWhatsAppUserRequest(userId));
    }, [userId, dispatch]);

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    useEffect(() => {
        if (pendingStatus.fetch) {
            setIsFetching(true);
            setError(null)
            return;
        }
        if (!pendingStatus.fetch && userData?.data) {
            setUserDetails(userData.data);
            setIsFetching(false);
            setError(null);
        } else if (!pendingStatus.fetch && !userData?.data) {
            setUserDetails(null);
            setIsFetching(false);
            setError("No user data found.");
        }
    }, [pendingStatus, userData]);

    const infoItems = useMemo(
        () => [
            { label: "User Name :", value: userDetails?.profileName },
            { label: "Last appointment :", value: userDetails?.flowTitle },
            { label: "Sentiment Score :", value: `${userDetails?.avgSentimentScores?.sentimentScore}/10` },
            { label: "Interaction Speed :", value: `${userDetails?.avgSentimentScores?.speedScore}/10` },
            { label: "Total Appointment :", value: userDetails?.totalAppointments || 0 },
            { label: "User Type :", value: userDetails?.userType },
            { label: "Behaviour Score :", value: `${userDetails?.avgSentimentScores?.behaviourScore}/10` },
            { label: "User Number :", value: userDetails?.whatsAppNumber },
            { label: "Last Appointment Status :", value: formatString(userDetails?.status) },
            { label: "User Created :", value: formatUpdatedDate(userDetails?.createdAt) },
            { label: "Last Visited :", value: formatUpdatedDate(userDetails?.lastActiveAt) },
        ],
        [userDetails]
    );

    if (isFetching) {
        return (
        <div className="flex justify-center items-center h-64">
            <CircularProgress />
        </div>
        );
    }

    if (error) {
        return renderAlert({
            type: "error",
            title: "Error!",
            message: error
        });
    }

    if (!userDetails) {
        return renderAlert({
            type: "info",
            title: "Info alert!",
            message: "No user details available."
        });
    }

    return (
        <div className="h-auto">
            <PageBreadcrumb pagePath="user-details" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] w-full sm:w-[40%]">
                        <div className="h-full rounded-xl p-1">
                            <div className="px-4 py-2 w-full">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Details</h3>
                            </div>
                            <div className="p-4 border-t dark:border-gray-800 sm:p-6 overflow-y-auto custom-scrollbar h-[350px]">
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
                            <div className="grid grid-cols-1 gap-2  px-4 py-2 border-t dark:border-gray-800 "></div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] w-full sm:w-[60%]">
                        <div className="h-full rounded-xl p-1">
                            <div className="px-4 py-2">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Activities</h3>
                            </div>
                            <div className="p-4 border-t dark:border-gray-800 sm:p-6 overflow-y-auto custom-scrollbar h-[350px] space-y-4">
                                <SentimentChartOne appointments={userDetails?.sentimentData} />
                            </div>
                            <div className="grid grid-cols-1 gap-2  px-4 py-2 border-t dark:border-gray-800 "></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
