"use client";

import React, { useEffect, useState, useCallback } from "react";
import { formatTime, formatStringDate, formatString } from "@/utils/utils";
import {
  CircularProgress,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TablePagination from '@mui/material/TablePagination';
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams,useRouter, usePathname } from 'next/navigation';
import dayjs, { Dayjs } from "dayjs";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Select from "@/components/form/Select";
import { AppDispatch } from "@/redux/store";
import { getAllPending, getAppointmentSelector } from "@/redux/reducers/appointment/selectors";
import { fetchAppointmentRequest } from "@/redux/reducers/appointment/actions";
import { customInputStyles } from "@/components/fieldProp/fieldPropsStyles";

const AppoinmentDetails = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [isFetching, setIsFetching] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPath = usePathname()
    const appointmentId:string | any = searchParams.get('appointmentId'); 
    const appointmentData = useSelector(getAppointmentSelector);
    const pendingStatus = useSelector(getAllPending);
   
    console.log(appointmentData?.data,'appointmentData')

    useEffect(() => {
        dispatch(fetchAppointmentRequest(appointmentId));
    }, [dispatch]);

    const InteractionType = (type: string) => {
        switch (type) {
            case 'booked': return "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500";
            case 'cancelled': return "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
            case 'rescheduled': return "!w-[100px] bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400";
            default: return '';
        }
    };

    return (
        <>
            <div className="h-auto">
                <PageBreadcrumb pagePath="appointment-details" />
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] w-full sm:w-[40%]">
                            <div className="h-full rounded-xl p-1">
                                <div className="px-4 py-2 w-full">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white w-full">
                                        {appointmentData?.data?.flowTitle}
                                    </h3>
                                </div>
                                <div className="p-4 border-t dark:border-gray-800 sm:p-6 overflow-y-auto custom-scrollbar max-h-[350px]">
                                    <div className="w-full flex justify-end">
                                        <span className={`text-xs px-0 py-1 mb-4 rounded-[4px] font-light block w-[90px] text-center ${InteractionType(appointmentData?.data?.status)}`}>
                                            {formatString(appointmentData?.data?.status)}
                                        </span>
                                    </div>
                                    <div className="border dark:border-gray-700 rounded-[4px]">
                                        {Object.entries(appointmentData?.data?.data ?? {}).map(([key, value], index) => (
                                            value ? (
                                                <div key={index} className={`${index>0 && 'border-t'} dark:border-gray-700 p-2 cursor-text`}>
                                                    {key === 'preference' && Array.isArray(value) ? (
                                                        value.map((prefItem: any, prefIndex: number) => (
                                                            Object.entries(prefItem).map(([question, answer], qIndex) => (
                                                                <div key={`${key}-${prefIndex}-${qIndex}`} className="ml-2">
                                                                    <p className="text-sm text-gray-400 dark:text-gray-400 mb-2">{formatString(question)} :</p>
                                                                    <p className="text-base font-semibold text-gray-900 dark:text-white">{String(answer)}</p>
                                                                </div>
                                                            ))
                                                        ))
                                                    ) : (
                                                        <>
                                                            <p className="text-sm text-gray-400 dark:text-gray-400 mb-2 ml-2">{formatString(key)} :</p>
                                                            <p className="text-base font-semibold text-gray-900 dark:text-white ml-2">{String(value)}</p>
                                                        </>
                                                    )}
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-2  px-4 py-2 border-t dark:border-gray-800 "></div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] w-full sm:w-[60%]">
                            <div className="h-full rounded-xl p-1">
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center px-4 py-2">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                        Chats
                                    </h3>
                                </div>
                                <div className="p-4 border-t dark:border-gray-800 sm:p-6 overflow-y-auto custom-scrollbar max-h-[350px] space-y-4">
                                    <div className="w-full flex justify-center">
                                        <span className="text-xxs mb-2 rounded-[6px] font-light block w-auto text-center text-white bg-white/30 px-2 py-1">
                                            {formatString(appointmentData?.data?.status)} {formatStringDate(appointmentData?.data?.updatedAt)}
                                        </span>
                                    </div>
                                    {appointmentData?.data?.history && 
                                    appointmentData?.data?.history.map((item:any, index:number) => {
                                        const isAI = item.sender === 'AI';
                                        return (
                                            <div
                                                key={item._id}
                                                className={`flex ${isAI ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`relative min-w-[20%] max-w-[50%] px-4 py-2 rounded-lg text-sm font-light ${
                                                        isAI
                                                        ? 'bg-[#465fff54] text-white rounded-br-none'
                                                        : 'bg-[#822cc76e] text-white rounded-bl-none'
                                                    }`}
                                                >
                                                    {Array.isArray(item.message) ? (
                                                        <div className="mb-4">
                                                            <div className="font-light">
                                                                {item.message[0]?.value}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="mb-4">
                                                            {item?.message}
                                                        </div>
                                                    )}
                                                    <span className="absolute bottom-1 right-2 text-[10px] text-white opacity-70">
                                                        {formatTime(item?.timestamp)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="grid grid-cols-1 gap-2  px-4 py-2 border-t dark:border-gray-800 "></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    
};

export default AppoinmentDetails;
