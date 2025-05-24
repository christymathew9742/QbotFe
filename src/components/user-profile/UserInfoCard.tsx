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

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
  const { accessToken } = parseCookies();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(getUserSelector);
  const pendingUpdates = useSelector(getUpdatePendingSelector);
  const userData = currentUser?.user?.data || {};
  const pendingFetch = useSelector(getFetchPendingSelector);

  useEffect(() => {
    dispatch(fetchUserRequest());
  },[dispatch, pendingUpdates]);

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      {pendingFetch || Object.keys(userData).length <1  ? (
        <div className="items-center text-center w-full gap-6 xl:flex-row ">
          <CircularProgress className="!text-[10px]"/>
        </div>
      ):(
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                User Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.username || '----'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.email || '-----'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Display Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.displayname || '----'}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.phone || '----'}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.bio || '----'}
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
