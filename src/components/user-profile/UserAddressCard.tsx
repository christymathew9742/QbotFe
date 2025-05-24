"use client";
import React, { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { AppDispatch } from "@/redux/store";
import { getFetchPendingSelector, getUpdatePendingSelector, getUserSelector } from "@/redux/reducers/user/selectors";
import { parseCookies } from "nookies";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRequest } from "@/redux/reducers/user/actions";
import { CircularProgress } from "@mui/material";

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(getUserSelector);
  const pendingUpdates = useSelector(getUpdatePendingSelector);
  const pendingFetch = useSelector(getFetchPendingSelector);
  const { accessToken } = parseCookies();
  const userData = currentUser?.user?.data || {};

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

  useEffect(() => {
      dispatch(fetchUserRequest());
  },[dispatch, pendingUpdates]);

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {pendingFetch || Object.keys(userData).length <1  ? (
          <div className="items-center text-center w-full gap-6 xl:flex-row ">
            <CircularProgress className="!text-[10px]"/>
          </div>
        ):(
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Country
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userData?.country || '----'}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  City/State
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userData?.state || '----'}, {userData?.country || '----'}.
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Postal Code
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userData?.postalcode || '----'}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  TAX ID
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userData?.taxId || '----'}
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
