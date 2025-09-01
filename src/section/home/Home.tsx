'use client';

import React, { useEffect } from "react";
import { WhatsAppMetrics }  from "@/components/whatsApp/WhatsAppMerics";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "@/redux/store";
import { fetchAppointmentRequest } from "@/redux/reducers/appointment/actions";
import WhatsAppAvgSentiment from "@/components/whatsApp/WhatsAppAvgSentiment";
import WhatsAppMonthlyAppointmentChart from "@/components/whatsApp/WhatsAppMonthlyAppointmentChart";
import WhatsAppStatCard from "@/components/whatsApp/WhatsAppRecentAppointments";
import { getWhatsAppGlobaleSelector, getAllPending } from "@/redux/reducers/user/selectors";
import { fetchWhatsRequest } from "@/redux/reducers/user/actions";

interface Metrix {
    totalUniqueUsers?: number;
    activeUserCount?: number;
    totalAppointments?: number;
    totalBookings?: number;
    appointmentComplited?: number
    pendingStatus?: any;
}

interface AppointmentStatus {
    todaysAppointments?: number;
    totalStatusCounts?:any;
    totalBookings?: number;
    totalUniqueUsers?: number;
    appointmentComplited?: number;
    todaysCancelledAppointments?: number;
    todaysCompletedAppointments?: number;
    totalAppointments?: number;
}
  
const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const pendingStatus = useSelector(getAllPending);
    const globalData =  useSelector(getWhatsAppGlobaleSelector)
    const isPending = !globalData || Object.keys(globalData).length < 1;
    
    useEffect(() => {
        dispatch(fetchAppointmentRequest());
        dispatch(fetchWhatsRequest());
    }, [dispatch]);

    const metricsData:Metrix = {
        totalUniqueUsers: globalData?.totalUniqueUsers,
        activeUserCount: globalData?.activeUserCount,
        appointmentComplited: globalData?.completedCount,
        totalBookings: globalData?.totalBooking,
        pendingStatus:pendingStatus?.fetch || isPending,
    };

    const appointmentStatus:AppointmentStatus = {
        todaysAppointments: globalData?.todaysAppointments || 0,
        totalStatusCounts: globalData?.totalStatusCounts || {},
        totalBookings: globalData?.totalBookings || 0,
        appointmentComplited: globalData?.appointmentComplited || 0,
        todaysCancelledAppointments: globalData?.todaysCancelledAppointments || 0,
        todaysCompletedAppointments: globalData?.todaysCompletedAppointments || 0,
        totalAppointments: globalData?.totalAppointments || 0,
    }

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 sm:col-span-7">
                <WhatsAppMetrics metrics = {metricsData} />
                <WhatsAppMonthlyAppointmentChart  monthlyAppointments={globalData?.monthlyAppointments || []}  pendingStatus={pendingStatus?.fetch || isPending} />
            </div>
            <div className="col-span-12 sm:col-span-5">
                <WhatsAppAvgSentiment  globalAverageSentimentScores={globalData?.globalAverageSentimentScores || []} pendingStatus={pendingStatus?.fetch || isPending} />
            </div>
             <div className="col-span-12  w-full mt-4">
                <WhatsAppStatCard  appointmentStatus={appointmentStatus || {}} pendingStatus={pendingStatus?.fetch || isPending}/>
            </div>
        </div>
    );
}

export default Home;
