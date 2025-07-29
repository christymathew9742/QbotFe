"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { get } from "lodash";
import { getAppointmentSelector } from "@/redux/reducers/appointment/selectors";
import { fetchAppointmentRequest } from "@/redux/reducers/appointment/actions";

export const metadata: Metadata = {
  title: "List all Qbot",
  description: "This is the Qbot listing page",
};

const totalCards = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: "Christy",
  number: `+123456789${i}`,
  botTitle: `Qbot ${i + 1}`,
  title: `Card ${i + 1}`,
  description: `Description for card ${i + 1}`,
}));

const Appoinment = () => {
  const [visibleCards, setVisibleCards] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const appointmentData = useSelector(getAppointmentSelector);

  useEffect(() => {
    dispatch(fetchAppointmentRequest(''))
  }, []);

  console.log("appointmentData", appointmentData);

  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom && visibleCards < totalCards.length && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleCards((prev) => prev + 4);
        setIsLoading(false);
      }, 800);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCards, isLoading]);

  return (
    <div>
      <PageBreadcrumb pagePath="Chatbot" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03]">
          <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              All Appointments
            </h3>
          </div>
          <div className="p-4 border-t dark:border-gray-800 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {appointmentData?.data?.slice(0, visibleCards).map((card:any) => {
                const month = new Date(card?.createdAt).toLocaleString('default', { month: 'long' });
                const day = new Date(card?.createdAt).getDate();
                const time = new Date(card?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div
                    key={card?.id}
                    className="flex rounded-xl w-full h-auto bg-white dark:bg-[#1f1f1f] text-black dark:text-white shadow-md transition-all border border-card-bg dark:border-card-bg hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <div className="bg-card-bg text-center px-4 py-2 flex flex-col justify-between rounded-l-xl w-24">
                      <div className="text-xl font-bold text-white/70">{month}</div>
                      <div className="text-lg font-medium text-white mb-4">{day}</div>
                      <div className="text-xxm text-white/70">{time}</div>
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between dark:bg-black rounded-tr-xl rounded-br-xl relative">
                      <div>
                        <div className="text-lg font-semibold font-mono">{card?.profileName}</div>
                        <div className={`absolute right-2 top-1.5 z-10 h-3 w-3 rounded-full ${card?.status == 'booked' ? 'bg-status-bg-active' : card?.status == 'cancelled' ?  'bg-status-bg-cancel': 'bg-status-bg-reactive'} flex`}></div>
                        <p className="text-sm text-[#666] dark:text-gray-400 mt-1">
                          {card?.flowTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {isLoading && (
              <div className="flex justify-center mt-6">
                <button
                  disabled
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full shadow-sm animate-pulse"
                >
                  Loading...
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appoinment;
