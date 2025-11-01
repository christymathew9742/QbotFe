"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { CircularProgress, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { baseURL } from "@/utils/url";
import { useRouter } from "next/navigation";
import { 
  getNotificationsSelector 
} from "@/redux/reducers/notification/selectors";
import { 
  fetchNotificationsRequest, 
  webSocketConnected, 
  updateNotificationsRequest 
} from "@/redux/reducers/notification/actions";
import { getUserSelector } from "@/redux/reducers/user/selectors";
import {formatStringDate}   from "@/utils/utils";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { notifications = [], unreadCount = 0 } = useSelector(getNotificationsSelector) || {};
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(getUserSelector);
  const userData = currentUser?.data;
  const router = useRouter();

  useEffect(() => {
    const socket = new WebSocket(baseURL);
    socket.onopen = () => {
      dispatch(webSocketConnected());
    };
    socket.onerror = (event: any) => event.message && console.error("WebSocket Error:", event.message);
    socket.onmessage = (event) => {
      const data = JSON.parse(event?.data);
      if(userData?._id === data?.userId) {
        dispatch(fetchNotificationsRequest({ showAll }));
      }
    };
    socket.onclose = () => console.log("WebSocket closed");
    return () => socket.close();
  }, [dispatch, showAll, userData, isOpen]);

  const handleNotificationClick = (id: string, appointmentId:string) => {
    dispatch(updateNotificationsRequest({ id, isRead: true }));
    router.push(`/appointment-details?appointmentId=${appointmentId}`);
    setTimeout(async() => {
        setIsOpen(false);
        await dispatch(fetchNotificationsRequest({ showAll }));
        setShowAll(false);
    }, 1000);
  };

  const handleShowAllNotifi = useCallback(() => {
    setShowAll((prev) => {
      const newValue = !prev;
      setLoad(true);
      setTimeout(async () => {
        await dispatch(fetchNotificationsRequest({ showAll: newValue }));
        setLoad(false);
      }, 1000);
      return newValue;
    });
  }, [dispatch]);

  const handleClose = useCallback(async () => {
    setIsOpen((prev) => !prev);
    await dispatch(fetchNotificationsRequest({ showAll: false }));
    setShowAll(isOpen)
  }, [dispatch, isOpen, showAll]);

  return (
    <div className="relative">
      {!userData  ? (
        <Skeleton
          animation="wave"
          variant="circular"
          width={45}
          height={45}
          className="dark:!border-gray-700 dark:!bg-gray-800"
        />
      ) : (
        <button
          onClick={handleClose}
          className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          {unreadCount > 0 && (
            <span className={`absolute text-xxs !min-w-[18px] px-1 py-0 -top-1  -right-2 rounded-full font-medium text-center bg-orange-500 text-white`}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
      <Dropdown
        isOpen={isOpen}
        onClose={handleClose}
        className={`absolute -right-[240px] mt-[4px] flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0 ${
          notifications.length ? "h-[480px] w-[300px]" : "h-[200px] w-[300px]"
        }`}
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notifications</h5>
        </div>
        {!notifications.length ? (
          <div className="w-full text-center col-span-3 flex justify-center">
            <span className="text-center py-10 text-gray-500">
              No Notifications Found!
            </span>
          </div>
        ) : (
          <>
            <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
              {notifications.map((notif: any) => (
                <li key={notif._id} className={!notif?.isRead ? "bg-notify" : ""}>
                  <DropdownItem
                    onItemClick={() =>
                      handleNotificationClick(notif?._id, notif?.appointmentId)
                    }
                    className="flex border-b border-gray-100 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                  >
                    <div className="w-1/10 flex items-start justify-center text-xs">📅</div>
                    <div className="w-9/10 flex flex-col ml-1">
                      <div className="text-gray-500 dark:text-white text-[12px] font-extralight">
                        <span className="text-[13px] font-medium">
                          {notif?.profileName || "WhatsApp"}
                        </span>{" "}
                        has {notif?.type} an appointment for{" "}
                        <span className="font-light">{notif?.chatBotTitle}</span>.
                      </div>
                      <div className="text-[11px] font-bold mt-2 text-gray-500 dark:text-white ">
                        {formatStringDate(notif?.createdAt)}
                      </div>
                    </div>
                  </DropdownItem>
                </li>
              ))}
            </ul>
            {notifications.length >= 5 && (
              <button
                onClick={handleShowAllNotifi}
                className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                {load ? (
                  <CircularProgress className="!w-4 !h-auto" />
                ) : showAll ? (
                  "Show Less"
                ) : (
                  "View All Notifications"
                )}
              </button>
            )}
          </>
        )}
      </Dropdown>
    </div>
  );
}

