// "use client";

// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { formatTime, formatStringDate, formatString, getValidUrlOrValue, getFormattedMessage } from "@/utils/utils";
// import { CircularProgress } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { useSearchParams } from "next/navigation";
// import { useAlert } from "@/components/alert/alert";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import { AppDispatch } from "@/redux/store";
// import {
//     getAllPending,
//     getAppointmentSelector,
// } from "@/redux/reducers/appointment/selectors";
// import { fetchAppointmentRequest, updateAppointmentRequest } from "@/redux/reducers/appointment/actions";
// import Select from "@/components/form/Select";
// import Label from "@/components/form/Label";
// import { updateUserRequest } from "@/redux/reducers/user/actions";


// const AppointmentDetails: React.FC = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const searchParams = useSearchParams();
//     const pendingStatus = useSelector(getAllPending);
//     const appointmentData = useSelector(getAppointmentSelector);
//     const [isFetching, setIsFetching] = useState(true);
//     const [value, setValue] = useState<string | null>(null);
//     const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
//     const [error, setError] = useState<string | null>(null);
//     const { renderAlert } = useAlert();
//     const appointmentId = useMemo(
//         () => searchParams.get("appointmentId"),
//         [searchParams]
//     );
//     // const userId = useMemo(
//     //     () => searchParams.get("userId"),
//     //     [searchParams]
//     // );
//     const options = useMemo(
//         () => [
//             { value: "booked", label: "Booked", disabled: true },
//             { value: "rescheduled", label: "Rescheduled", disabled: true  },
//             { value: "cancelled", label: "Cancelled" },
//             { value: "completed", label: "Completed" },
//         ],
//     []);
//     const handleStatusChange = useCallback((value: string) => {
//         setValue(value);
//     }, []);

//     const fetchAppointment = useCallback(() => {
//         if (!appointmentId) {
//             setError("Invalid appointment ID.");
//             setIsFetching(false);
//             return;
//         }
//         setIsFetching(true);
//         setError(null);
//         dispatch(fetchAppointmentRequest(appointmentId));
//     }, [appointmentId, dispatch]);

//     useEffect(() => {
//         fetchAppointment();
//     }, [fetchAppointment]);

//     useEffect(() => {
//         dispatch(updateAppointmentRequest({id: appointmentId, status: value }));
//         // dispatch(updateUserRequest({ status: value }));
//         fetchAppointment();
//     },[value, dispatch, appointmentId])

//     useEffect(() => {
//         if (pendingStatus.fetch) {
//             setIsFetching(true);
//             setError(null);
//             return;
//         }

//         if (!pendingStatus.fetch && appointmentData?.data) {
//             setAppointmentDetails(appointmentData.data);
//             setIsFetching(false);
//             setError(null);
//         } else if (!pendingStatus.fetch && !appointmentData?.data) {
//             setAppointmentDetails(null);
//             setIsFetching(false);
//             setError("No appointment data found.");
//         }
//     }, [pendingStatus, appointmentData]);

//     const InteractionType = useCallback((type: string) => {
//         console.log("Type:", type);
//         switch (type) {
//         case "booked":
//             return "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500";
//         case "cancelled":
//             return "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
//         case "rescheduled":
//             return "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400";
//         case "completed":
//             return "text-white bg-status-bg-completed dark:text-white";
//         default:
//             return "";
//         }
//     }, []);

//     useEffect(() => {
//         if (!appointmentId) return;
//     }, [dispatch, appointmentId]);

//     if (isFetching) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <CircularProgress />
//             </div>
//         );
//     }

//     if (error) {
//         return renderAlert({
//             type: "error",
//             title: "Error!",
//             message: error,
//         });
//     }

//     if (!appointmentDetails) {
//         return renderAlert({
//             type: "info",
//             title: "Info alert!",
//             message: "No appointment details available.",
//         });
//     }

//     const { appointment } = appointmentDetails;

//     return (
//         <div className="h-auto">
//             <PageBreadcrumb pagePath="Appointments, Details" />
//             <div className="space-y-6">
//                 <div className="flex flex-col sm:flex-row gap-4">
//                     <div className="rounded-2xl border border-gray-200 dark:border-color-primary bg-white dark:bg-white/[0.03] w-full sm:w-[40%]">
//                         <div className="h-full rounded-xl p-1">
//                             <div className="px-4 py-2 w-full">
//                                 <h3 className="text-lg font-semibold text-color-primary dark:text-white w-full">
//                                     Details
//                                 </h3>
//                             </div>
//                             <div className="p-4 border-t dark:border-color-primary sm:p-6 overflow-y-auto custom-scrollbar h-[350px]">
//                                 <div className="w-full flex justify-between items-center mb-4">
//                                     <span className="text-sm font-light dark:text-white">
//                                         📅 {appointment?.flowTitle || "-"}
//                                     </span>
//                                     <div className="flex items-center gap-2">
//                                         <span
//                                             className={`text-xxxs px-2 py-1 rounded-full font-medium w-auto text-center ${InteractionType(
//                                                 appointment?.status || ""
//                                             )}`}
//                                         >
//                                             {formatString(value || appointment?.status || "")}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className="border dark:border-gray-700 rounded-[4px]">
//                                     {Object.entries(appointment?.data ?? {}).map(([key, value], index) => {
//                                         if (value === undefined || value === null) return null;
//                                         if (key === "preference" && Array.isArray(value)) {
//                                             return (
//                                                 <div key={index}>
//                                                     {value.map((pref, i) =>
//                                                         Object.entries(pref).map(([pKey, pVal], j) => (
//                                                         <div
//                                                             className={`${index > 0 ? "border-t" : ""} dark:border-gray-700 cursor-text`}
//                                                             key={`${i}-${j}`}
//                                                         >
//                                                             <div className="p-2">
//                                                                 <p className="text-sm text-color-primary-light dark:text-color-primary-light mb-2 ml-2">
//                                                                     {formatString(pKey)} :
//                                                                 </p>
//                                                                 <p className="text-base font-semibold color-primary dark:text-white ml-2">
//                                                                     {String(pVal)}
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                         ))
//                                                     )}
//                                                 </div>
//                                             );
//                                         }
//                                         return typeof value !== "object" ? (
//                                             <div
//                                                 key={index}
//                                                 className={`${index > 0 ? "border-t" : ""} dark:border-gray-700 cursor-text`}
//                                             >
//                                                 <div className="p-2">
//                                                 <p className="text-sm text-color-primary-light dark:text-color-primary-light mb-2 ml-2">
//                                                     {formatString(key)} :
//                                                 </p>
//                                                 <p className="text-base font-semibold color-primary dark:text-white ml-2">
//                                                     {getValidUrlOrValue(value)}
//                                                 </p>
//                                                 </div>
//                                             </div>
//                                         ) : null;
//                                     })}
//                                 </div>
//                                 <div className="w-full mt-4">
//                                     <Label className="text-sm text-color-primary-light dark:text-color-primary-light mb-2" htmlFor="status-select">Update Status :</Label>
//                                     <Select
//                                         options={options}
//                                         defaultValue={value || appointment?.status || ""}
//                                         placeholder="Update Status"
//                                         onChange={handleStatusChange}
//                                         className="dark:bg-white/[0.02] text-color-primary dark:!text-gray-100"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="grid grid-cols-1 gap-2  px-4 py-2 border-t dark:border-color-primary "></div>
//                         </div>
//                     </div>
//                     <div className="rounded-2xl border border-gray-200 dark:border-color-primary bg-white dark:bg-white/[0.03] w-full sm:w-[60%]">
//                         <div className="h-full rounded-xl p-1">
//                             <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center px-4 py-2">
//                                 <h3 className="text-lg font-semibold text-color-primary dark:text-white">
//                                 Recent chats
//                                 </h3>
//                             </div>
//                             <div className="p-4 border-t dark:border-color-primary sm:p-6 overflow-y-auto custom-scrollbar h-[350px] space-y-4">
//                                 <div className="w-full flex justify-center">
//                                     <span className="text-xxs mb-2 rounded-[6px] font-light block w-auto text-center bg-[#8c97b8] text-white dark:bg-white/30 px-2 py-1">
//                                         {formatString(value || appointment?.status || "")}{" "}
//                                         {formatStringDate(appointment?.updatedAt || "")}
//                                     </span>
//                                 </div>
//                                 {appointment?.history
//                                 ?.filter(
//                                     (item: any) =>
//                                     (Array.isArray(item.message) &&
//                                         typeof item.message[0]?.value !== "object") ||
//                                     (!Array.isArray(item.message) &&
//                                         typeof item.message !== "object")
//                                 ).map((item: any) => {
//                                     const isAI = item.sender === "AI";
//                                     return (
//                                     <div
//                                         key={item._id}
//                                         className={`flex ${
//                                             isAI ? "justify-end" : "justify-start"
//                                         }`}
//                                     >
//                                         <div
//                                             className={`relative min-w-[20%] max-w-[50%] px-4 py-2 rounded-[12px] text-sm font-light ${
//                                                 isAI
//                                                 ? "bg-[#822cc7b0] dark:bg-[#465fff54] text-white !rounded-br-none"
//                                                 : "bg-[#465fffcf] dark:bg-[#822cc76e] text-white !rounded-bl-none"
//                                             }`}
//                                         >
//                                             {Array.isArray(item.message) ? (
//                                                 <div className="mb-4">
//                                                     <div className="font-light">
//                                                         {getFormattedMessage(item.message)}
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <div className="mb-4">
//                                                     {getFormattedMessage(item.message)}
//                                                 </div>
//                                             )}
//                                             <span className="absolute bottom-1 right-2 text-[10px] text-white opacity-70">
//                                                 {formatTime(item?.timestamp)}
//                                             </span>
//                                         </div> 
//                                     </div>
//                                     );
//                                 })}
//                             </div>
//                             <div className="grid grid-cols-1 gap-2  px-4 py-2 border-t dark:border-color-primary "></div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AppointmentDetails;


"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { formatTime, formatStringDate, formatString, getValidUrlOrValue, getFormattedMessage, extractDateTime } from "@/utils/utils"; // Make sure extractDateTime is imported
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useAlert } from "@/components/alert/alert";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { AppDispatch } from "@/redux/store";
import {
    getAllPending,
    getAppointmentSelector,
} from "@/redux/reducers/appointment/selectors";
import { fetchAppointmentRequest, updateAppointmentRequest } from "@/redux/reducers/appointment/actions";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";

const AppointmentDetails: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    const pendingStatus = useSelector(getAllPending);
    const appointmentData = useSelector(getAppointmentSelector);
    const [isFetching, setIsFetching] = useState(true);
    const [value, setValue] = useState<string | null>(null);
    const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { renderAlert } = useAlert();
    
    const appointmentId = useMemo(
        () => searchParams.get("appointmentId"),
        [searchParams]
    );

    const options = useMemo(
        () => [
            { value: "booked", label: "Booked", disabled: true },
            { value: "rescheduled", label: "Rescheduled", disabled: true },
            { value: "cancelled", label: "Cancelled" },
            { value: "completed", label: "Completed" },
        ],
        []
    );

    const handleStatusChange = useCallback((newValue: string) => {
        setValue(newValue);
        if (appointmentId) {
            dispatch(updateAppointmentRequest({ id: appointmentId, status: newValue }));
            setTimeout(() => {
                dispatch(fetchAppointmentRequest(appointmentId));
            }, 500);
        }
    }, [dispatch, appointmentId]);

    const fetchAppointment = useCallback(() => {
        if (!appointmentId) {
            setError("Invalid appointment ID.");
            setIsFetching(false);
            return;
        }
        setIsFetching(true);
        setError(null);
        dispatch(fetchAppointmentRequest(appointmentId));
    }, [appointmentId, dispatch]);

    useEffect(() => {
        fetchAppointment();
    }, [fetchAppointment]);

    useEffect(() => {
        if (pendingStatus.fetch) {
            setIsFetching(true);
            setError(null);
            return;
        }

        if (!pendingStatus.fetch && appointmentData?.data) {
            setAppointmentDetails(appointmentData.data);
            setIsFetching(false);
            setError(null);
        } else if (!pendingStatus.fetch && !appointmentData?.data) {
            setAppointmentDetails(null);
            setIsFetching(false);
            setError("No appointment data found.");
        }
    }, [pendingStatus, appointmentData]);

    const InteractionType = useCallback((type: string) => {
        switch (type) {
            case "booked":
                return "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500";
            case "cancelled":
                return "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
            case "rescheduled":
                return "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400";
            case "completed":
                return "text-white bg-status-bg-completed dark:text-white";
            default:
                return "";
        }
    }, []);

    if (isFetching) return <div className="flex justify-center items-center h-64"><CircularProgress /></div>;
    if (error) return renderAlert({ type: "error", title: "Error!", message: error });
    if (!appointmentDetails) return renderAlert({ type: "info", title: "Info alert!", message: "No appointment details available." });

    const { appointment } = appointmentDetails;

    return (
        <div className="h-auto">
            <PageBreadcrumb pagePath="Appointments, Details" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="rounded-2xl border border-gray-200 dark:border-color-primary bg-white dark:bg-white/[0.03] w-full sm:w-[40%]">
                        <div className="h-full rounded-xl p-1">
                            <div className="px-4 py-2 w-full">
                                <h3 className="text-lg font-semibold text-color-primary dark:text-white w-full">Details</h3>
                            </div>
                            <div className="p-4 border-t dark:border-color-primary sm:p-6 overflow-y-auto custom-scrollbar h-[350px]">
                                <div className="w-full flex justify-between items-center mb-4">
                                    <span className="text-sm font-light dark:text-white">📅 {appointment?.flowTitle || "-"}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xxxs px-2 py-1 rounded-full font-medium w-auto text-center ${InteractionType(appointment?.status || "")}`}>
                                            {formatString(value || appointment?.status || "")}
                                        </span>
                                    </div>
                                </div>
                                <div className="border dark:border-gray-700 rounded-[4px]">
                                    {Object.entries(appointment?.data ?? {}).map(([key, value], index) => {
                                        if (value === undefined || value === null) return null;

                                        if (key === "preference" && Array.isArray(value)) {
                                            return (
                                                <div key={index}>
                                                    {value.map((pref, i) =>
                                                        Object.entries(pref).map(([pKey, pVal], j) => {
                                                            
                                                            let displayValue = String(pVal);
                                                            if (pKey.toLowerCase().includes("slot")) {
                                                                const extracted = extractDateTime([{ [pKey]: pVal }]);
                                                                if (extracted.startTime) {
                                                                    displayValue = `${extracted.startTime} - ${extracted.endTime}`;
                                                                    if (extracted.date && extracted.month) {
                                                                        displayValue += `, ${extracted.month} ${extracted.date}`;
                                                                    }
                                                                }
                                                            }
                                                            return (
                                                                <div className={`${index > 0 ? "border-t" : ""} dark:border-gray-700 cursor-text`} key={`${i}-${j}`}>
                                                                    <div className="p-2">
                                                                        <p className="text-sm text-color-primary-light dark:text-color-primary-light mb-2 ml-2">
                                                                            {formatString(pKey)} :
                                                                        </p>
                                                                        <p className="text-base font-semibold text-color-primary dark:text-white ml-2">
                                                                            {displayValue}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            );
                                        }
                                        return typeof value !== "object" ? (
                                            <div key={index} className={`${index > 0 ? "border-t" : ""} dark:border-gray-700 cursor-text`}>
                                                <div className="p-2">
                                                    <p className="text-sm text-color-primary-light dark:text-color-primary-light mb-2 ml-2">
                                                        {formatString(key)} :
                                                    </p>
                                                    <p className="text-base font-semibold text-color-primary dark:text-white ml-2">
                                                        {getValidUrlOrValue(value)}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                                <div className="w-full mt-4">
                                    <Label className="text-sm text-color-primary-light dark:text-color-primary-light mb-2" htmlFor="status-select">Update Status :</Label>
                                    <Select
                                        options={options}
                                        defaultValue={value || appointment?.status || ""}
                                        placeholder="Update Status"
                                        onChange={handleStatusChange}
                                        className=" bg-white dark:bg-white/[0.02] text-color-primary dark:!text-gray-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 dark:border-color-primary bg-white dark:bg-white/[0.03] w-full sm:w-[60%]">
                        <div className="h-full rounded-xl p-1">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center px-4 py-2">
                                <h3 className="text-lg font-semibold text-color-primary dark:text-white">Recent chats</h3>
                            </div>
                            <div className="p-4 border-t dark:border-color-primary sm:p-6 overflow-y-auto custom-scrollbar h-[350px] space-y-4">
                                <div className="w-full flex justify-center">
                                    <span className="text-xxs mb-2 rounded-[6px] font-light block w-auto text-center bg-[#8c97b8] text-white dark:bg-white/30 px-2 py-1">
                                        {formatString(value || appointment?.status || "")}{" "}
                                        {formatStringDate(appointment?.updatedAt || "")}
                                    </span>
                                </div>
                                {appointment?.history?.filter((item: any) =>
                                    (Array.isArray(item.message) && typeof item.message[0]?.value !== "object") ||
                                    (!Array.isArray(item.message) && typeof item.message !== "object")
                                ).map((item: any) => {
                                    const isAI = item.sender === "AI";
                                    return (
                                        <div key={item._id} className={`flex ${isAI ? "justify-end" : "justify-start"}`}>
                                            <div className={`relative min-w-[20%] max-w-[50%] px-4 py-2 rounded-[12px] text-sm font-light ${isAI ? "bg-app-theme dark:bg-[#465fff54] text-white !rounded-br-none" : "bg-[#465fffcf] dark:bg-[#822cc76e] text-white !rounded-bl-none"}`}>
                                                <div className="mb-4">
                                                    {getFormattedMessage(item.message)}
                                                </div>
                                                <span className="absolute bottom-1 right-2 text-[10px] text-white opacity-70">
                                                    {formatTime(item?.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetails;
