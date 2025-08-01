"use client";

import React, { useEffect } from "react";
import { AppDispatch } from "@/redux/store";
import { getFetchPendingSelector, getUpdateUserPendingSelector, getUserSelector } from "@/redux/reducers/user/selectors";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRequest } from "@/redux/reducers/user/actions";
import { Box, Skeleton } from "@mui/material";

export default function UserAddressCard() {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(getUserSelector);
  const pendingUpdates = useSelector(getUpdateUserPendingSelector);
  const pendingFetch = useSelector(getFetchPendingSelector);
  const userData = currentUser?.user?.data || {};

  useEffect(() => {
      dispatch(fetchUserRequest());
  },[dispatch, pendingUpdates]);

  const addressFields = [
    { label: 'Country', value: userData?.country },
    {
      label: 'City/State',
      value: `${userData?.state || '----'}, ${userData?.country || '----'}.`,
    },
    { label: 'Postal Code', value: userData?.postalcode },
    { label: 'TAX ID', value: userData?.taxId },
  ];

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="gap-6 lg:flex-row lg:items-start lg:justify-between">
        {pendingFetch || Object.keys(userData).length <1  ? (
          <Box sx={{ width: '100%' }}>
            <Skeleton animation="wave" className="!mb-4 w-[25%] dark:!border-gray-700 dark:!bg-gray-800"/>
            <Skeleton animation="wave" className="dark:!border-gray-700 dark:!bg-gray-800"/>
            <Skeleton animation="wave" className="dark:!border-gray-700 dark:!bg-gray-800"/>
            <Skeleton animation="wave" className="dark:!border-gray-700 dark:!bg-gray-800"/>
            <Skeleton animation="wave" className="dark:!border-gray-700 dark:!bg-gray-800"/>
            <Skeleton animation="wave" className="dark:!border-gray-700 dark:!bg-gray-800"/>
            <Skeleton animation="wave" className="dark:!border-gray-700 dark:!bg-gray-800"/>
          </Box>
        ):(
          <div className="flex-1 sm:w-[50%]">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              {addressFields.map(({ label, value }) => (
                <div key={label}>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {value || '----'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
