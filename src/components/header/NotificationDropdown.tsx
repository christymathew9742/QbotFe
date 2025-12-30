"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { CircularProgress, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { baseURL } from "@/utils/url";
import { useRouter } from "next/navigation";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import {
  getNotificationsSelector
} from "@/redux/reducers/notification/selectors";
import {
  fetchNotificationsRequest,
  webSocketConnected,
  updateNotificationsRequest
} from "@/redux/reducers/notification/actions";
import { getUserSelector } from "@/redux/reducers/user/selectors";
import { formatStringDate } from "@/utils/utils";

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
      if (userData?._id === data?.userId) {
        dispatch(fetchNotificationsRequest({ showAll }));
      }
    };
    socket.onclose = () => console.log("WebSocket closed");
    return () => socket.close();
  }, [dispatch, showAll, userData, isOpen]);

  const handleNotificationClick = (id: string, appointmentId: string) => {
    dispatch(updateNotificationsRequest({ id, isRead: true }));
    router.push(`/appointment-details?appointmentId=${appointmentId}`);
    setTimeout(async () => {
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
    <div className="relative z-50">
      {!userData ? (
        <Skeleton
          animation="wave"
          variant="circular"
          width={30}
          height={30}
          className="dark:!border-gray-700 dark:!bg-color-primary"
        />
      ) : (
        <button
          onClick={handleClose}
          className={`relative flex items-center justify-center text-color-primary  border-2 border-color-primary-light transition-all duration-200 rounded-full h-8 w-8
            ${isOpen ?  'dark:bg-color-primary dark:text-white' : 'bg-white text-color-primary-light dark:border-color-primary dark:bg-gray-900 dark:text-color-primary-light dark:hover:bg-color-primary dark:hover:text-white'}
          `}
        >
          {unreadCount > 0 && (
            <span className="absolute flex items-center justify-center min-w-[18px] h-[18px] px-1 -top-1 -right-1 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd" 
              d="M10 2C10.75 2 11.5 2.5 11.5 3.2V3.5C14.3 4.1 16.5 6.5 16.5 9.5V14H17.5C17.9 14 18.2 14.3 18.2 14.7C18.2 15.1 17.9 15.4 17.5 15.4H2.5C2.1 15.4 1.8 15.1 1.8 14.7C1.8 14.3 2.1 14 2.5 14H3.5V9.5C3.5 6.5 5.7 4.1 8.5 3.5V3.2C8.5 2.5 9.25 2 10 2ZM8 17C8 18.1 8.9 19 10 19C11.1 19 12 18.1 12 17H8Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}

      <Dropdown
        isOpen={isOpen}
        onClose={handleClose}
        className={`absolute sm:right-0 mt-3 p-1 flex flex-col bg-white dark:bg-gray-dark ring-1 ring-black/5 dark:ring-white/10 sm:w-[380px] transition-all transform origin-top-right z-50
        ${notifications.length ? "h-auto max-h-[85vh]" : "h-auto"}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-dark sticky top-0 z-10">
          <h5 className="text-[17px] font-bold text-color-primary-light dark:text-gray-100">Notifications</h5>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!notifications.length ? (
            <div className="flex flex-col items-center justify-center py-12">
               <div className="bg-gray-50 dark:bg-white/5 rounded-full p-4 mb-3">
                  <NotificationsOffIcon className="text-color-primary-light!" />
               </div>
              <span className="text-sm font-medium text-color-primary-light dark:text-gray-400">
                No notifications yet
              </span>
            </div>
          ) : (
            <ul className="flex flex-col">
              {notifications.map((notif: any) => (
                <li key={notif._id} className="relative group">
                  <DropdownItem
                    onItemClick={() =>
                      handleNotificationClick(notif?._id, notif?.appointmentId)
                    }
                    className={`flex items-start w-full px-4 py-3 transition-colors duration-200 border-b border-gray-50 dark:border-gray-800 
                      ${!notif?.isRead ? "bg-notify dark:bg-blue-900/10" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
                  >
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-lg">
                        {!notif?.isRead ? (
                          <NotificationsActiveIcon className="text-color-primary-light!" />
                        ) : (
                          <NotificationsOffIcon className="text-color-primary-light!" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xxm leading-snug text-color-primary dark:text-gray-200">
                        <span className="font-semibold text-color-primary dark:text-white">
                          {notif?.profileName || "WhatsApp"}
                        </span>{" "}
                        has {notif?.type} an appointment for{" "}
                        <span className="font-semibold text-color-primary dark:text-blue-300">{notif?.chatBotTitle}</span>
                      </p>
                      <p className="text-xxs font-medium text-color-primary-light mt-1">
                        {formatStringDate(notif?.createdAt)}
                      </p>
                    </div>
                    {!notif?.isRead && (
                       <span className="w-2.5 h-2.5 bg-color-primary rounded-full mt-2 ml-2 flex-shrink-0"></span>
                    )}
                  </DropdownItem>
                </li>
              ))}
            </ul>
          )}
        </div>
        {notifications.length >= 5 && (
          <div className="p-2 border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
            <button
              onClick={handleShowAllNotifi}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-color-primary transition-colors rounded-lg dark:text-white dark:hover:bg-white/10"
            >
              {load ? (
                <CircularProgress className="!w-4 !h-auto mr-2 text-color-primary" />
              ) : null}
              {showAll ? "Show Less" : "See all notifications"}
            </button>
          </div>
        )}
      </Dropdown>
    </div>
  );
}

