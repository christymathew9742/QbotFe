// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import { formatTime, formatStringDate, formatString } from "@/utils/utils";
// import {
//   CircularProgress,
// } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { useSearchParams } from 'next/navigation';

// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import { AppDispatch } from "@/redux/store";
// import { getAllPending, getAppointmentSelector } from "@/redux/reducers/appointment/selectors";
// import { fetchAppointmentRequest } from "@/redux/reducers/appointment/actions";

// const AppoinmentDetails = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const [isFetching, setIsFetching] = useState(true);
//     const searchParams = useSearchParams();
//     const appointmentId:string | any = searchParams.get('appointmentId'); 
//     const appointmentData = useSelector(getAppointmentSelector);
//     const pendingStatus = useSelector(getAllPending);
   
//     console.log(appointmentData?.data,'appointmentData')

//     useEffect(() => {
//         if(isFetching) {
//           setIsFetching(pendingStatus.fetch);
//         }
//     }, [pendingStatus]);

//     useEffect(() => {
//         dispatch(fetchAppointmentRequest(appointmentId));
//     }, [dispatch]);

//     const InteractionType = (type: string) => {
//         switch (type) {
//             case 'booked': return "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500";
//             case 'cancelled': return "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
//             case 'rescheduled': return "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400";
//             case 'completed': return "bg-green-100 text-white dark:bg-status-bg-completed dark:text-white";
//             default: return "";
//         }
//     };

//     return (
//         <>
//             <div className="h-auto">
//                 <PageBreadcrumb pagePath="appointment-details" />
//                 <div className="space-y-6">
//                     <div className="flex flex-col sm:flex-row gap-4">
//                         <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] w-full sm:w-[40%]">
//                             <div className="h-full rounded-xl p-1">
//                                 <div className="px-4 py-2 w-full">
//                                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white w-full">
//                                         Details
//                                     </h3>
//                                 </div>
//                                 {isFetching ? (
//                                     <div className="w-full col-span-3 flex justify-center text-center border-t dark:border-gray-800">
//                                     <span  className="text-center py-6">
//                                         <CircularProgress/>
//                                     </span>
//                                     </div>
//                                 ) : (
//                                     <div className="p-4 border-t dark:border-gray-800 sm:p-6 overflow-y-auto custom-scrollbar max-h-[350px]">
//                                         <div className="w-full flex justify-between items-center mb-4">
//                                             <span className="text-sm font-light dark:text-white">
//                                                 📅 {appointmentData?.data?.appointment?.flowTitle}
//                                             </span>
//                                             <div className="flex items-center gap-2">
//                                                 <span className={`text-xxxs px-2 py-1 rounded-full font-medium w-auto text-center ${InteractionType(appointmentData?.data?.appointment?.status)}`}>
//                                                     {formatString(appointmentData?.data?.appointment?.status)}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <div className="border dark:border-gray-700 rounded-[4px]">
//                                             {Object.entries(appointmentData?.data?.appointment?.data ?? {}).map(([key, value], index) => (
//                                                 value ? (
//                                                     <div key={index} className={`${index>0 && 'border-t'} dark:border-gray-700 cursor-text`}>
//                                                         {key === 'preference' && Array.isArray(value) ? (
//                                                             value.map((prefItem: any, prefIndex: number) => (
//                                                                 Object.entries(prefItem).map(([question, answer]) => (
//                                                                     <div key={`${key}-${prefIndex}`} className={`${prefIndex>0 && 'border-t'} dark:border-gray-700 p-2`}>
//                                                                         <p className="text-sm text-gray-400 dark:text-gray-400 mb-2 ml-2">{formatString(question)} :</p>
//                                                                         <p className="text-base font-semibold text-gray-900 dark:text-white ml-2">{String(answer)}</p>
//                                                                     </div>
//                                                                 ))
//                                                             ))
//                                                         ) : (
//                                                             <div className="p-2">
//                                                                 <p className="text-sm text-gray-400 dark:text-gray-400 mb-2 ml-2">{formatString(key)} :</p>
//                                                                 <p className="text-base font-semibold text-gray-900 dark:text-white ml-2">{String(value)}</p>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 ) : null
//                                             ))}
//                                         </div>
//                                     </div>
//                                 ) }
//                                 <div className="grid grid-cols-1 gap-2  px-4 py-2 border-t dark:border-gray-800 "></div>
//                             </div>
//                         </div>
//                         <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] w-full sm:w-[60%]">
//                             <div className="h-full rounded-xl p-1">
//                                 <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center px-4 py-2">
//                                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
//                                         Chats
//                                     </h3>
//                                 </div>
//                                 {isFetching ? (
//                                     <div className="w-full col-span-3 flex justify-center text-center border-t dark:border-gray-800">
//                                     <span  className="text-center py-6">
//                                         <CircularProgress/>
//                                     </span>
//                                     </div>
//                                 ) : (
//                                     <div className="p-4 border-t dark:border-gray-800 sm:p-6 overflow-y-auto custom-scrollbar max-h-[350px] space-y-4">
//                                         <div className="w-full flex justify-center">
//                                             <span className="text-xxs mb-2 rounded-[6px] font-light block w-auto text-center dark:text-white dark:bg-white/30 px-2 py-1">
//                                                 {formatString(appointmentData?.data?.appointment?.status)} {formatStringDate(appointmentData?.data?.appointment?.updatedAt)}
//                                             </span>
//                                         </div>
//                                         {appointmentData?.data?.appointment?.history && 
//                                         appointmentData?.data?.appointment?.history.map((item:any, index:number) => {
//                                             const isAI = item.sender === 'AI';
//                                             return (
//                                                 <div
//                                                     key={item._id}
//                                                     className={`flex ${isAI ? 'justify-end' : 'justify-start'}`}
//                                                 >
//                                                     <div
//                                                         className={`relative min-w-[20%] max-w-[50%] px-4 py-2 rounded-[12px] text-sm font-light ${
//                                                             isAI
//                                                             ? 'bg-[#465fff54] text-white !rounded-br-none'
//                                                             : 'bg-[#822cc76e] text-white !rounded-bl-none'
//                                                         }`}
//                                                     >
//                                                         {Array.isArray(item.message) ? (
//                                                             <div className="mb-4">
//                                                                 <div className="font-light">
//                                                                     {item.message[0]?.value}
//                                                                 </div>
//                                                             </div>
//                                                         ) : (
//                                                             <div className="mb-4">
//                                                                 {item?.message}
//                                                             </div>
//                                                         )}
//                                                         <span className="absolute bottom-1 right-2 text-[10px] text-white opacity-70">
//                                                             {formatTime(item?.timestamp)}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 )}
//                                 <div className="grid grid-cols-1 gap-2  px-4 py-2 border-t dark:border-gray-800 "></div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
    
// };

// export default AppoinmentDetails;


"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { formatTime, formatStringDate, formatString } from "@/utils/utils";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useAlert } from "@/components/alert/alert";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { AppDispatch } from "@/redux/store";
import { getAllPending, getAppointmentSelector } from "@/redux/reducers/appointment/selectors";
import { fetchAppointmentRequest } from "@/redux/reducers/appointment/actions";

const AppointmentDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  // Get appointmentId from query params
  const appointmentId = useMemo(() => searchParams.get("appointmentId"), [searchParams]);

  // Redux state selectors
  const pendingStatus = useSelector(getAllPending);
  const appointmentData = useSelector(getAppointmentSelector);

  // Local UI state
  const [isFetching, setIsFetching] = useState(true);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { renderAlert } = useAlert();

  // Memoized callback for fetching appointment data
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

  // Trigger fetch on mount or appointmentId change
  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

  // Watch Redux loading and data state
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

  // Helper to get status class for badge
  const InteractionType = useCallback((type: string) => {
    switch (type) {
      case "booked":
        return "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500";
      case "cancelled":
        return "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
      case "rescheduled":
        return "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400";
      case "completed":
        return "bg-green-100 text-white dark:bg-status-bg-completed dark:text-white";
      default:
        return "";
    }
  }, []);

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

    if (!appointmentDetails) {
        return renderAlert({
            type: "info",
            title: "Info alert!",
            message: "No appointment details available."
        });
    }

  const { appointment } = appointmentDetails;

  return (
    <>
      <div className="h-auto">
        <PageBreadcrumb pagePath="appointment-details" />
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Left Details Panel */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] w-full sm:w-[40%]">
              <div className="h-full rounded-xl p-1">
                <div className="px-4 py-2 w-full">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white w-full">
                    Details
                  </h3>
                </div>
                <div className="p-4 border-t dark:border-gray-800 sm:p-6 overflow-y-auto custom-scrollbar max-h-[350px]">
                  <div className="w-full flex justify-between items-center mb-4">
                    <span className="text-sm font-light dark:text-white">
                      📅 {appointment?.flowTitle || "-"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xxxs px-2 py-1 rounded-full font-medium w-auto text-center ${InteractionType(
                          appointment?.status || ""
                        )}`}
                      >
                        {formatString(appointment?.status || "")}
                      </span>
                    </div>
                  </div>
                  <div className="border dark:border-gray-700 rounded-[4px]">
                    {Object.entries(appointment?.data ?? {}).map(([key, value], index) =>
                      value ? (
                        <div
                          key={index}
                          className={`${index > 0 ? "border-t" : ""} dark:border-gray-700 cursor-text`}
                        >
                          {key === "preference" && Array.isArray(value) ? (
                            value.map((prefItem: any, prefIndex: number) =>
                              Object.entries(prefItem).map(([question, answer]) => (
                                <div
                                  key={`${key}-${prefIndex}`}
                                  className={`${prefIndex > 0 ? "border-t" : ""} dark:border-gray-700 p-2`}
                                >
                                  <p className="text-sm text-gray-400 dark:text-gray-400 mb-2 ml-2">
                                    {formatString(question)} :
                                  </p>
                                  <p className="text-base font-semibold text-gray-900 dark:text-white ml-2">
                                    {String(answer)}
                                  </p>
                                </div>
                              ))
                            )
                          ) : (
                            <div className="p-2">
                              <p className="text-sm text-gray-400 dark:text-gray-400 mb-2 ml-2">
                                {formatString(key)} :
                              </p>
                              <p className="text-base font-semibold text-gray-900 dark:text-white ml-2">
                                {String(value)}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2  px-4 py-2 border-t dark:border-gray-800 "></div>
              </div>
            </div>

            {/* Right Chats Panel */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] w-full sm:w-[60%]">
              <div className="h-full rounded-xl p-1">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center px-4 py-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Chats
                  </h3>
                </div>
                <div className="p-4 border-t dark:border-gray-800 sm:p-6 overflow-y-auto custom-scrollbar max-h-[350px] space-y-4">
                  <div className="w-full flex justify-center">
                    <span className="text-xxs mb-2 rounded-[6px] font-light block w-auto text-center dark:text-white dark:bg-white/30 px-2 py-1">
                      {formatString(appointment?.status || "")}{" "}
                      {formatStringDate(appointment?.updatedAt || "")}
                    </span>
                  </div>
                  {appointment?.history?.map((item: any) => {
                    const isAI = item.sender === "AI";
                    return (
                      <div
                        key={item._id}
                        className={`flex ${isAI ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`relative min-w-[20%] max-w-[50%] px-4 py-2 rounded-[12px] text-sm font-light ${
                            isAI
                              ? "bg-[#465fff54] text-white !rounded-br-none"
                              : "bg-[#822cc76e] text-white !rounded-bl-none"
                          }`}
                        >
                          {Array.isArray(item.message) ? (
                            <div className="mb-4">
                              <div className="font-light">{item.message[0]?.value}</div>
                            </div>
                          ) : (
                            <div className="mb-4">{item?.message}</div>
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

export default AppointmentDetails;

