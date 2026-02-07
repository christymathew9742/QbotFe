"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CircularProgress,
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
import { extractDateTime } from "@/utils/utils";
import BookIcon from '@mui/icons-material/Book';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CallIcon from '@mui/icons-material/Call';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { getUserSelector } from "@/redux/reducers/user/selectors";

const Appoinment = () => {
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
  const currentUser = useSelector(getUserSelector);
  const userData = currentUser?.data || {};

  useEffect(() => {
    setIsFetching(pendingStatus.fetch);
  }, [pendingStatus.fetch]);

  const fetchAppointments = useCallback(() => {
    const query = {
      search,
      status: status || "",
      page,
      limit: rowsPerPage,
      ...(selectedDate && { date: dayjs(selectedDate).format("YYYY-MM-DD") }),
    };

    const queryString = new URLSearchParams(query as any).toString();
    dispatch(fetchAppointmentRequest(queryString));
  }, [dispatch, search, status, selectedDate, page, rowsPerPage]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleDateChange = useCallback((newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    setPage(1);
  }, []);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setIsLoad(false)
    setPage(newPage + 1);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoad(false)
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  }, []);

  const options = useMemo(
    () => [
      { value: "", label: "All" },
      { value: "cancelled", label: "Cancelled" },
      { value: "booked", label: "Booked" },
      { value: "rescheduled", label: "Rescheduled" },
      { value: "completed", label: "Completed" },
    ],
    []
  );

  return (
    <>
      <div>
        <PageBreadcrumb pagePath="Appointments" />
        <div className="space-y-6 mb-4">
          <div className="rounded-md shadow-xl backdrop-blur-sm p-1 dark:border-color-primary bg-white dark:bg-white/[0.03]">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center px-6 py-5">
              <h3 className="text-lg font-semibold text-color-primary dark:text-white">
                All Appointments
              </h3>
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <SearchIcon className="text-color-primary-light! dark:text-amber-50!" />
                </span>
                <Input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search..."
                  className="py-2.5 pl-12 pr-14 text-sm dark:bg-dark-900 bg-transparent dark:bg-white/[0.02]"
                />
              </div>
              <Select
                options={options}
                defaultValue={status || ""}
                onChange={handleStatusChange}
                className="dark:bg-white/[0.02] text-color-primary dark:!text-gray-100"
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={customInputStyles}
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </LocalizationProvider>
            </div>
            <div className="p-4 border-t dark:border-color-primary sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {isFetching && isload ? (
                  <div className="w-full col-span-3 flex justify-center py-6">
                    <CircularProgress />
                  </div>
                ) : appointmentData?.data?.length ? (
                  appointmentData.data.map((card: any) => {
                    const slot = card?.data || {};
                    const rawTimeStr = slot["Select Specific Time"] as string
                    const dateData: any = rawTimeStr ? extractDateTime(rawTimeStr as string) : {};
                    const now = card?.createdAt ? new Date(card.createdAt) : new Date();
                    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    const statusKey = card?.status?.toLowerCase()?.trim();
                    const statusColors: Record<string, string> = {
                      booked: "bg-status-bg-active",
                      cancelled: "bg-red-300 dark:bg-status-bg-cancel",
                      rescheduled: "bg-status-bg-reactive",
                      completed: "bg-status-bg-completed",
                    };
                    const statusClass = statusColors[statusKey] || "";

                    return (
                      <Link
                        href={`/appointment-details?appointmentId=${card?._id}`}
                        passHref
                        key={card?._id}
                      >
                        <div className="flex rounded-md w-full h-auto bg-white dark:bg-[#1f1f1f] text-black dark:text-white shadow-md transition-all border border-[#493e8130] dark:border-app-theme-dark hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                          <div className="bg-app-theme text-center flex flex-col justify-between dark:bg-app-theme-dark rounded-l-md w-30">
                            <div className="text-xl font-bold text-white/70 py-2">
                              {dateData?.month || now.toLocaleDateString('en-IN', { month: 'short', timeZone: userTimeZone })}
                            </div>
                            <div className="text-5xl font-medium text-white mb-4">
                              {dateData?.date || now.toLocaleDateString('en-IN', { day: 'numeric', timeZone: userTimeZone })}
                            </div>
                            <div className="text-xxxs text-white/70 pb-1 flex items-center justify-center gap-1">
                              {dateData?.startTime && (
                                <>
                                  <AccessAlarmIcon className="text-xxs! mb-0.5!" />
                                  <span>{`${dateData.startTime} - ${dateData.endTime}`}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 p-4 flex flex-col justify-between dark:bg-black rounded-md relative">
                            <div>
                              <div className="text-lg font-semibold font-mono text-color-primary">
                                <AccountCircleIcon className="text-color-primary-light mr-2 w-16 mb-1" />
                                {card?.profileName}
                              </div>
                              <div className="text-xxs font-extralight font-mono mt-2 text-color-primary-light">
                                <CallIcon className="text-color-primary-light mr-1 ml-2 w-4!" />
                                {card?.whatsAppNumber}
                              </div>
                              <div className={`absolute right-2 top-1.5 z-10 h-3 w-3 rounded-full ${statusClass}`} />
                              <p className="text-sm text-app-theme dark:text-color-primary-light mt-2">
                                <BookIcon className="text-color-primary-light! mr-1 ml-2 w-4! mb-1" />
                                {card?.flowTitle?.length > 16
                                  ? `${card.flowTitle.slice(0, 13)}...`
                                  : card?.flowTitle}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="w-full text-center col-span-3 flex justify-center">
                    <span className="text-center py-10 text-color-primary-light">
                      No Appointments Found!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {appointmentData?.totalBookings > 6 && (
        <TablePagination
          component="div"
          className="text-amber-50"
          rowsPerPageOptions={[5, 10, 25]}
          count={appointmentData?.totalBookings || 0}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  );
};

export default Appoinment;

