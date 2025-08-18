'use client';

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { WhatsAppMetrics }  from "@/components/whatsApp/WhatsAppMerics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import {
  CircularProgress,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TablePagination from "@mui/material/TablePagination";
import { useDispatch, useSelector } from "react-redux";
import dayjs, { Dayjs } from "dayjs";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { AppDispatch } from "@/redux/store";
import {
  getAllPending,
  getAppointmentSelector,
} from "@/redux/reducers/appointment/selectors";
import { fetchAppointmentRequest } from "@/redux/reducers/appointment/actions";
import { customInputStyles } from "@/components/fieldProp/fieldPropsStyles";
import WhatsAppMonthlySalesChart from "@/components/whatsApp/WhatsAppMonthlyAppointmentChart";
import WhatsAppAvgSentiment from "@/components/whatsApp/WhatsAppAvgSentiment";
import WhatsAppRecentAppointments from "@/components/whatsApp/WhatsAppRecentAppointments";
import WhatsAppMonthlyAppointmentChart from "@/components/whatsApp/WhatsAppMonthlyAppointmentChart";
import { AppointmentIcon } from "@/icons";
import WhatsAppStatCard from "@/components/whatsApp/WhatsAppRecentAppointments";

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

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [isFetching, setIsFetching] = useState(true);
    const [isload, setIsLoad] = useState(true)
    
    const appointmentData = useSelector(getAppointmentSelector);
    const pendingStatus = useSelector(getAllPending);
console.log(appointmentData,'appo')
    const isPending = !appointmentData || Object.keys(appointmentData).length < 1;
    console.log(appointmentData,'isPending')

    useEffect(() => {
        setIsFetching(pendingStatus.fetch);
    }, [pendingStatus.fetch, isPending]);
    
    useEffect(() => {
        dispatch(fetchAppointmentRequest());
    }, [dispatch]);

    const metricsData:Metrix = {
        totalUniqueUsers: appointmentData?.totalUniqueUsers,
        activeUserCount: appointmentData?.activeUserCount,
        appointmentComplited: appointmentData?.appointmentComplited,
        totalBookings: appointmentData?.totalBookings,
        pendingStatus:pendingStatus?.fetch || isPending,
    };

    const appointmentStatus:AppointmentStatus = {
        todaysAppointments: appointmentData?.todaysAppointments || 0,
        totalStatusCounts: appointmentData?.totalStatusCounts || {},
        totalBookings: appointmentData?.totalBookings || 0,
        appointmentComplited: appointmentData?.appointmentComplited || 0,
        todaysCancelledAppointments: appointmentData?.todaysCancelledAppointments || 0,
        todaysCompletedAppointments: appointmentData?.todaysCompletedAppointments || 0,
        totalAppointments: appointmentData?.totalAppointments || 0,
    }

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 sm:col-span-7">
                <WhatsAppMetrics metrics = {metricsData} />
                <WhatsAppMonthlyAppointmentChart  monthlyAppointments={appointmentData?.monthlyAppointments || []}  pendingStatus={pendingStatus?.fetch || isPending} />
            </div>
            <div className="col-span-12 sm:col-span-5">
                <WhatsAppAvgSentiment  globalAverageSentimentScores={appointmentData?.globalAverageSentimentScores || []} pendingStatus={pendingStatus?.fetch || isPending} />
            </div>
             <div className="col-span-12  w-full mt-4">
                <WhatsAppStatCard  appointmentStatus={appointmentStatus || {}} pendingStatus={pendingStatus?.fetch || isPending}/>
            </div>
        </div>
    );
}

export default Home;
