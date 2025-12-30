"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  HorizontaLDots,
  WhatsApp,
} from "../icons/index";
import SettingsIcon   from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WebhookIcon from '@mui/icons-material/Webhook';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <HomeIcon />,
    name: "Home",
    path: "/",
  },
  {
    icon: <SmartToyIcon />,
    name: "Chatbots",
    subItems: [
      { name: "Create Bot", path: "/chatbot-details", pro: false },
      { name: "Manage Bot", path: "/chatbot", pro: false },
    ],
  },
  {
    icon: <WhatsApp />,
    name: "WhatsApp",
    subItems: [
      { name: "Appointments", path: "/appointments", pro: false },
      { name: "Users", path: "/users", pro: false },
    ],
  },
  {
    icon: <SettingsIcon />,
    name: "Settings",
    subItems: [
      { name: "User Profile", path: "/profile", pro: false },
      { name: "General", path: "/general-settings", pro: false },
    ],
  },
];

const IntegrationsItems: NavItem[] = [
  {
    icon: <WebhookIcon />,
    name: "WebHooks",
    subItems: [
      { name: "Configuration", path: "/api-config", pro: false },
      { name: "API Setup", path: "/generate-token", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen } = useSidebar();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "menu" | "Integrations";
    index: number;
  } | null>(null);

  const [allowFlyout, setAllowFlyout] = useState(false);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    if (isExpanded || isMobileOpen) {
      setAllowFlyout(false);
    } else {
      const timer = setTimeout(() => {
        setAllowFlyout(true);
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [isExpanded, isMobileOpen]);

  useEffect(() => {
    if (!isExpanded && !isMobileOpen) return;

    let submenuMatched = false;
    ["menu", "Integrations"].forEach((menuType) => {
      const items = menuType === "menu" ? navItems : IntegrationsItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "menu" | "Integrations",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, isExpanded, isMobileOpen]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    index: number,
    menuType: "menu" | "Integrations"
  ) => {
    if (!isExpanded && !isMobileOpen) return;

    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const baseItemClasses =
    "group relative flex items-center gap-2.5 rounded-lg px-4 py-2.5 font-medium duration-300 ease-in-out hover:bg-sidebar-theme/[0.08]";
  const activeItemClasses =
    "bg-sidebar-theme/[0.12]! text-sidebar-theme dark:text-white";
  const inactiveItemClasses =
    "text-color-primary-light! dark:text-color-primary-light hover:text-sidebar-theme dark:hover:text-white";

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "menu" | "Integrations"
  ) => (
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => {
        const isSubmenuOpen =
          openSubmenu?.type === menuType && openSubmenu?.index === index;
        const isChildActive = nav.subItems?.some((sub) => isActive(sub.path));
        const isSelfActive = nav.path && isActive(nav.path);

        if (isExpanded || isMobileOpen) {
          return (
            <li key={nav.name} className="relative">
              {nav.subItems ? (
                <>
                  <button
                    onClick={() => handleSubmenuToggle(index, menuType)}
                    className={`${baseItemClasses} w-full ${
                      isChildActive || isSubmenuOpen
                        ? activeItemClasses
                        : inactiveItemClasses
                    } cursor-pointer`}
                  >
                    <span
                      className={
                        isChildActive || isSubmenuOpen
                          ? "text-sidebar-theme dark:text-white"
                          : ""
                      }
                    >
                      {nav.icon}
                    </span>
                    <span className="ml-1 whitespace-nowrap duration-200 fade-in-text">
                      {nav.name}
                    </span>
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                        isSubmenuOpen
                          ? "rotate-180 text-sidebar-theme dark:text-white"
                          : "text-color-primary-light"
                      }`}
                    />
                  </button>
                  <div
                    ref={(el) => {
                      subMenuRefs.current[`${menuType}-${index}`] = el;
                    }}
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      height: isSubmenuOpen
                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                        : "0px",
                    }}
                  >
                    <ul className="mt-2 space-y-1 pl-9 pr-2">
                      {nav.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.path}
                            className={`group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium duration-300 ease-in-out ${
                              isActive(subItem.path)
                                ? "bg-sidebar-theme/[0.08] text-sidebar-theme dark:text-white"
                                : "text-color-primary-light hover:text-sidebar-theme dark:text-color-primary-light dark:hover:text-white"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 min-w-[6px] rounded-full duration-300 ${
                                isActive(subItem.path)
                                  ? "bg-sidebar-theme"
                                  : "bg-gray-300 group-hover:bg-sidebar-theme"
                              }`}
                            ></span>
                            <span className="whitespace-nowrap">
                              {subItem.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                nav.path && (
                  <Link
                    href={nav.path}
                    className={`${baseItemClasses} ${
                      isSelfActive ? activeItemClasses : inactiveItemClasses
                    }`}
                  >
                    <span
                      className={
                        isSelfActive ? "text-sidebar-theme dark:text-white" : ""
                      }
                    >
                      {nav.icon}
                    </span>
                    <span className="ml-1 whitespace-nowrap duration-200 fade-in-text">
                      {nav.name}
                    </span>
                  </Link>
                )
              )}
            </li>
          );
        }

        return (
          <li key={nav.name} className="group relative">
            {nav.subItems ? (
              <div
                className={`${baseItemClasses} ${
                  isChildActive ? activeItemClasses : inactiveItemClasses
                } cursor-pointer justify-center px-2`}
              >
                <span
                  className={
                    isChildActive ? "text-sidebar-theme dark:text-white" : ""
                  }
                >
                  {nav.icon}
                </span>
              </div>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`${baseItemClasses} ${
                    isSelfActive ? activeItemClasses : inactiveItemClasses
                  } justify-center px-2`}
                >
                  <span
                    className={
                      isSelfActive ? "text-sidebar-theme dark:text-white" : ""
                    }
                  >
                    {nav.icon}
                  </span>
                </Link>
              )
            )}

            {allowFlyout && (
              <div className="absolute left-full top-0 z-50 ml-3 invisible opacity-0 -translate-x-2 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                <div className="rounded-lg border border-sidebar-theme/10 bg-white px-3 py-2 shadow-lg dark:border-white/10 dark:bg-gray-800 w-max min-w-[140px]">
                  <span className="mb-2 block border-b border-gray-100 pb-1 text-xs font-bold text-color-primary dark:border-gray-700 dark:text-gray-400">
                    {nav.name}
                  </span>
                  {nav.subItems ? (
                    <ul className="flex flex-col gap-1">
                      {nav.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.path}
                            className={`block rounded px-2 py-1.5 text-sm font-medium transition-colors ${
                              isActive(subItem.path)
                                ? "bg-sidebar-theme/10 text-sidebar-theme dark:text-white"
                                : "text-color-primary-light hover:bg-sidebar-theme/[0.12] dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="absolute left-0 top-3.5 -ml-1 h-2 w-2 -rotate-45 border-l border-t border-sidebar-theme/10 bg-white dark:border-white/10 dark:bg-gray-800"></div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-sidebar-theme/[0.1] bg-white color-primary transition-all duration-300 ease-in-out dark:border-sidebar-theme/[0.2] dark:bg-gray-900 lg:mt-0 mt-16
        ${isExpanded || isMobileOpen ? "w-[240px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      <div
        className={`flex items-center h-auto bg-sidebar-theme/[0.12] p-[8px] mb-8 ${
          !isExpanded && !isMobileOpen ? "justify-center" : "justify-start px-6"
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          {isExpanded || isMobileOpen ? (
            <Image
              className="dark:hidden"
              src="/images/logo/app-logo-full.png"
              alt="Logo"
              width={150}
              height={30}
              priority
            />
          ) : (
            <Image
              src="/images/logo/app-logo.png"
              alt="Logo"
              width={40}
              height={32}
              priority
            />
          )}
        </Link>
      </div>
      <div
        className={`flex flex-col duration-300 ease-linear no-scrollbar ${
          isExpanded || isMobileOpen ? "overflow-y-auto" : "overflow-visible"
        }`}
      >
        <nav className="mb-6 px-4">
          <div className="flex flex-col gap-6">
            <div>
              <h2
                className={`mb-4 flex text-xxs font-semibold uppercase text-color-primary-light ${
                  !isExpanded && !isMobileOpen
                    ? "justify-center"
                    : "justify-start px-4"
                }`}
              >
                {isExpanded || isMobileOpen ? (
                  <span className="whitespace-nowrap fade-in-text">Menu</span>
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "menu")}
            </div>
            <div>
              <h2
                className={`mb-4 flex text-xxs font-semibold uppercase text-color-primary-light ${
                  !isExpanded && !isMobileOpen
                    ? "justify-center"
                    : "justify-start px-4"
                }`}
              >
                {isExpanded || isMobileOpen ? (
                  <span className="whitespace-nowrap fade-in-text">Integrations</span>
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(IntegrationsItems, "Integrations")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
