"use client";

import React, { useState, useEffect, useRef } from "react";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";
import Link from "next/link";
import { AppDispatch } from "@/redux/store";
import {
  getUpdateUserPendingSelector,
  getUserSelector,
} from "@/redux/reducers/user/selectors";
import { parseCookies } from "nookies";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRequest } from "@/redux/reducers/user/actions";
import { Expried } from "@/icons/index";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const userUpdatesStatus = useSelector(getUpdateUserPendingSelector);
  const { accessToken } = parseCookies();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(getUserSelector);
  const userData = currentUser?.data;
  const tockenDetails = userData?.tokenDetails || {};

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (accessToken) dispatch(fetchUserRequest());
  }, [dispatch, accessToken, userUpdatesStatus]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky bg-hdbg top-0 z-40 flex w-full backdrop-blur-md border-b border-theme-border transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-grow items-center justify-between px-3 py-2 md:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            aria-controls="sidebar"
            onClick={handleToggle}
            className="group relative p-1.5 flex h-8 w-10 items-center justify-center rounded-md border border-gray-200 text-color-primary-light transition-all hover:border-[#493e81]/30 hover:bg-gray-50 hover:text-[#493e81] dark:border-gray-800 dark:text-color-primary-light dark:hover:text-white"
          >
            {isMobileOpen ? (
               <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                 <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
               </svg>
            ) : (
              <MenuOpenIcon className="h-6 w-6"/>
            )}
          </button>

          <Link href="/" className="lg:hidden flex-shrink-0">
            <Image
              width={32}
              height={32}
              className="dark:hidden"
              src="/images/logo/app-logo.png"
              alt="Logo"
            />
            <Image
              width={32}
              height={32}
              className="hidden dark:block"
              src="/images/logo/app-logo.png"
              alt="Logo"
            />
          </Link>
        </div>
        <div className="flex items-center justify-end gap-3 sm:gap-6 w-full">
          {tockenDetails?.hastocken && (
            <div className="hidden sm:flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xxs text-red-600 font-extralight dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              <span className="flex h-4 w-4 items-center justify-center">
                 <Expried />
              </span>
              <p>
                Free trial {tockenDetails?.isExpired ? "ended" : "ends in "}
                {!tockenDetails?.isExpired && (
                  <strong className="ml-1 font-bold">{tockenDetails?.remaining}</strong>
                )}
              </p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleApplicationMenu}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-[#493e81] dark:bg-[#2e2a45] dark:text-color-primary-light lg:hidden"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="2" />
                <circle cx="10" cy="4" r="2" />
                <circle cx="10" cy="16" r="2" />
              </svg>
            </button>
            <div
              className={`${
                isApplicationMenuOpen
                  ? "absolute right-0 top-16 w-full max-w-[250px] flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-xl dark:border-[#2e2a45] dark:bg-[#1a1c2e]"
                  : "hidden"
              } lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-4 lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none`}
            >
              {tockenDetails?.hastocken && (
                 <div className="sm:hidden mb-3 flex items-center gap-2 rounded-md bg-red-50 p-2 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    <Expried />
                    <span>Trial {tockenDetails?.isExpired ? "ended" : `ends: ${tockenDetails?.remaining}`}</span>
                 </div>
              )}
              <div className="flex items-center justify-end gap-3">
                 <NotificationDropdown />
                 <div className="h-8 w-[1px] bg-gray-200 dark:bg-[#2e2a45] hidden lg:block"></div>
                 <UserDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
