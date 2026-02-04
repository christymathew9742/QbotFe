"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Tabs,
  Tab,
  Box,
  Button,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Fade 
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import axios from "axios";
import Cookies from "universal-cookie";
import { baseURL } from "@/utils/url";
import GoogleIcon from "@mui/icons-material/Google";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SensorsIcon from '@mui/icons-material/Sensors';
import FactoryIcon from '@mui/icons-material/Factory';
import { toast } from "react-toastify";
import FormInputProps from "@/components/fieldProp/FormInputProps";
import { FieldConfig } from "@/components/fieldProp/fieldConfig";
import { AppDispatch } from "@/redux/store";
import { getUserSelector, getUpdateUserPendingSelector } from "@/redux/reducers/user/selectors";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRequest, updateUserRequest } from "@/redux/reducers/user/actions";
import ConfirmModal from "@/components/ConfirmModal"; // Imported Confirmation Modal

interface SettingsData {
  botName: string;
  generalWelcomeMessage: string;
  autoSendBookingPdf: boolean;
  timezone: string;
  language: string;
  monthlyTarget: number,
  inactivityTimeoutMinutes: number;
};

function CustomTabPanel(props: { children?: React.ReactNode; index: number; value: number; }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
      className="w-full"
    >
      {value === index && (
        <Fade in={value === index} timeout={500}>
          <Box sx={{ py: 3 }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

const GeneralSettings = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialTab = parseInt(searchParams.get("tab") || "0");
  const [tabValue, setTabValue] = useState(isNaN(initialTab) ? 0 : initialTab);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [googleStatus, setGoogleStatus] = useState({ isConnected: false, email: "" });
  const chatbotFields = FieldConfig.find((sec) => sec.section === "chatbotFields")?.fields || [];
  const systemFields = FieldConfig.find((sec) => sec.section === "systemFields")?.fields || [];
  const inactivityTimeoutMinutes = FieldConfig.find((sec) => sec.section === "inactivityTimeoutMinutes")?.fields || [];
  const receiptSettings = FieldConfig.find((sec) => sec.section === "receiptSettings")?.fields || [];
  const [isFetching, setIsFetching] = useState(true);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(getUserSelector);
  const pendingStatus:any = useSelector(getUpdateUserPendingSelector);
  const userData = currentUser?.data || {};
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  useEffect(() => {
      setIsFetching(pendingStatus.fetch);
  }, [pendingStatus.fetch]);


  useEffect(() => {
    dispatch(fetchUserRequest());
  },[dispatch, pendingStatus]);

  const initialValues = useMemo<SettingsData>(() => ({
    botName: userData.botName || "",
    generalWelcomeMessage: userData.generalWelcomeMessage || "",
    autoSendBookingPdf: userData.autoSendBookingPdf === true || userData.autoSendBookingPdf === "true",
    timezone: userData.timezone || (typeof window !== "undefined" && window.Intl ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC"),
    language: (typeof window !== "undefined" && window.navigator ? navigator.language : "en-US"),
    monthlyTarget: userData.monthlyTarget || 0,
    inactivityTimeoutMinutes: userData.inactivityTimeoutMinutes || 3,
  }), [userData]);
  
  useEffect(() => {
    if (!searchParams.has("tab")) {
      router.replace(`${pathname}?tab=0`, { scroll: false });
    }
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const tabParam = parseInt(searchParams.get("tab") || "0");
    if (!isNaN(tabParam) && tabParam !== tabValue) {
      setTabValue(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const googleConnected = searchParams.get("status");
    if (googleConnected === "connected") {
      toast.success("Google Calendar connected.");
      router.replace(`${pathname}?tab=${tabValue}`, { scroll: false });
    }
    if (googleConnected === "disconnected") {
      toast.error("Google account already in use or calendar not connected.");
      router.replace(`${pathname}?tab=${tabValue}`, { scroll: false });
    }
  }, [searchParams, router, pathname, tabValue]);

  useEffect(() => {
    const checkGoogleStatus = async () => {
      try {
        const cookies = new Cookies();
        const token = cookies.get("accessToken");
        if (!token) { setIsLoadingStatus(false); return; }

        const { data } = await axios.get(`${baseURL}/auth/google/calendar/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGoogleStatus({ isConnected: data?.isConnected, email: data?.email || "" });
      } catch (error) {
        console.error("Failed to fetch Google status", error);
      } finally {
        setIsLoadingStatus(false);
      }
    };
    checkGoogleStatus();
  }, []);

  const handleConnectGoogleCalendar = async () => {
    setIsConnectingGoogle(true);
    try {
      const cookies = new Cookies();
      const token = cookies.get("accessToken");
      if (!token) { toast.error("Not logged in."); return; }
      const { data } = await axios.get(`${baseURL}/auth/google/calendar/connect`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data?.url) window.location.href = data.url;
    } catch (error: any) {
      toast.error("Connection Failed.");
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const handleDisconnectClick = () => {
    setIsDisconnectModalOpen(true);
  };

  const processDisconnectGoogle = async () => {
    setIsDisconnecting(true);
    try {
      const cookies = new Cookies();
      const token = cookies.get("accessToken");
      await axios.post(`${baseURL}/auth/google/calendar/disconnect`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setGoogleStatus({ isConnected: false, email: "" });
      toast.success("Calendar unlinked successfully.");
      setIsDisconnectModalOpen(false);
    } catch (error) {
      toast.error("Failed to disconnect calendar.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const validationSchema = Yup.object({
    monthlyTarget: Yup.number().min(1).required("Required"),
    inactivityTimeoutMinutes: Yup.number().min(1).required("Required"),
  });

  const onSubmit = useCallback (
    async (values: SettingsData) => {
      try {
          setIsUpdate(true);
          setTimeout(async () => {
              await dispatch(updateUserRequest(values));
              setIsUpdate(false)
          }, 1500);
      } catch (error) {
          console.error('Update failed:', error);
      } 
    },
    [pendingStatus, dispatch]
  );

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
          <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pagePath="Settings" />
      <div className="mx-auto space-y-6 pb-20">
        <div  className="dark:border-gray-800 dark:bg-gray-900 p-6 rounded-md! shadow-xl! backdrop-blur-sm! bg-white">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
               <h1 className="text-xl font-bold text-color-primary dark:text-white">General Settings</h1>
               <p className="text-sm text-color-primary-light dark:text-gray-400 mt-1">
                 Manage your system preferences and chatbot configuration.
               </p>
             </div>
           </div>
        </div>
        <div className="rounded-md! shadow-xl! backdrop-blur-sm! bg-white! dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
            <Tabs 
              value={tabValue} 
              onChange={(e, v) => { 
                setTabValue(v); 
                router.replace(`${pathname}?tab=${v}`, { scroll: false }); 
              }} 
              variant="scrollable" 
              scrollButtons="auto" 
              sx={{ 
                px: 2, 
                '& .MuiTab-root': { 
                  color: '#493e81b8 !important', 
                  textTransform: 'none', 
                  fontWeight: 500,
                  transition: 'all 0.3s'
                }, 
                '& .Mui-selected': { 
                  color: '#493e81 !important', 
                  fontWeight: 600,  
                  borderBottom: '2px solid #493e81 !important' 
                } 
              }}
            >
              <Tab label="System Preferences" />
              <Tab label="Chatbot Configuration" />
            </Tabs>
          </Box>
          <Formik 
            initialValues={initialValues} 
            enableReinitialize={true} 
            validationSchema={validationSchema} 
            onSubmit={onSubmit} 
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="p-6 md:p-8 min-h-[400px]">
                  <CustomTabPanel value={tabValue} index={0}>
                    <div className="max-w-3xl space-y-10">
                      <section>
                        <div className="flex items-center gap-2 mb-4">
                          <CalendarMonthIcon className="text-color-primary!" />
                          <h3 className="text-lg font-semibold text-color-primary dark:text-white">Calendar Integration</h3>
                        </div>
                        <Card variant="outlined" className="bg-blue-50/50! dark:bg-blue-900/10 border-gray-200 rounded-xl!">
                          <CardContent className="p-5 md:p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex gap-4">
                                <div className="mt-1 p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm h-fit">
                                    <GoogleIcon className="text-color-primary! text-2xl!" />
                                </div>
                                <div>
                                  <h4 className="text-base font-bold text-color-primary dark:text-white">Google Calendar</h4>
                                  {isLoadingStatus ? <div className="h-4 w-48 bg-gray-200 animate-pulse rounded mt-2"></div> : googleStatus.isConnected ? (
                                      <div className="mt-1 space-y-1">
                                          <p className="text-sm font-medium text-emerald-600 flex items-center gap-1.5">Active {googleStatus.email && <span className="text-gray-500 font-normal">({googleStatus.email})</span>}</p>
                                          <p className="text-xs text-color-primary-light max-w-sm">Bot will sync bookings here.</p>
                                      </div>
                                  ) : <p className="text-sm text-color-primary-light mt-1 max-w-sm">Connect calendar to automate bookings.</p>}
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-3 min-w-40">
                                {isLoadingStatus ? <CircularProgress size={24} className="mx-auto" /> : googleStatus.isConnected ? (
                                  <>
                                    <Button
                                      variant="outlined"  target="_blank"
                                      href={googleStatus.email && googleStatus.email.includes("@") 
                                          ? `https://calendar.google.com/calendar/r?authuser=${googleStatus.email}` 
                                          : "https://accounts.google.com/AccountChooser?continue=https://calendar.google.com/calendar/r"}
                                      className="text-green-600! bg-green-50! border border-green-400!" 
                                      sx={{ textTransform: 'none', borderRadius: '8px', marginTop: '8px' }}
                                    >
                                      Open Calendar
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        onClick={handleDisconnectClick} // Changed to open modal
                                        className="text-red-600! bg-red-50! border border-red-200!" 
                                        sx={{ textTransform: 'none', borderRadius: '8px', marginTop: '8px' }}
                                    >
                                        Disconnect
                                    </Button>
                                  </>
                                ) : (
                                  <Button sx={{ textTransform: 'none', backgroundColor: 'white', marginTop: '8px' }} variant="outlined" onClick={handleConnectGoogleCalendar} disabled={isConnectingGoogle} startIcon={!isConnectingGoogle && <SensorsIcon fontSize="large"/>} className=" bg-white text-color-primary! border! border-color-primary! rounded-lg!">
                                    {isConnectingGoogle ? "Connecting..." : "Connect Account"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </section>
                      <Divider className="dark:border-gray-800" />
                      <section>
                        <div className="flex items-center gap-2 mb-6 mt-4">
                          <DisplaySettingsIcon className="text-color-primary!" />
                          <h3 className="text-lg font-semibold text-color-primary dark:text-white">Regional & Limits</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {systemFields.map((field) => (
                            <FormInputProps key={field.name} Config={field} />
                          ))}
                        </div>
                        <div className="pt-6">
                          <Divider className="dark:border-gray-800" />
                          <div className="flex items-center gap-2 mb-6 mt-4">
                            <FactoryIcon className="text-color-primary!" />
                            <h3 className="text-lg font-semibold text-color-primary dark:text-white">Inactivity Rules</h3>
                          </div>
                          <div className="max-w-md">
                            {inactivityTimeoutMinutes.map((field) => (
                                <FormInputProps key={field.name} Config={field} />
                            ))}
                          </div>
                        </div>
                      </section>
                    </div>
                  </CustomTabPanel>
                  <CustomTabPanel value={tabValue} index={1}>
                    <section className="max-w-3xl space-y-10">
                      <div className="flex items-center gap-2 mb-4">
                        <ManageAccountsIcon className="text-color-primary!" />
                        <h3 className="text-lg font-semibold text-color-primary dark:text-white">Business Profile</h3>
                      </div>
                      <div className="max-w-3xl space-y-4">
                        {chatbotFields.map((field) => (
                          <FormInputProps key={field.name} Config={field} />
                        ))}
                      </div>
                      <Divider className="dark:border-gray-800 mt-6!" />
                      <div className="flex items-center gap-2 mt-4 mb-6">
                        <PictureAsPdfIcon className="text-color-primary!" />
                        <h3 className="text-lg font-semibold text-color-primary dark:text-white">Booking Summary</h3>
                      </div>
                      <div className="max-w-3xl space-y-4">
                        {receiptSettings.map((field) => (
                          <FormInputProps key={field.name} Config={field} />
                        ))}
                      </div>
                    </section>
                  </CustomTabPanel>
                </div>
                <div className="border-t p-6 border-gray-300 flex justify-end  bottom-0 bg-white/80">
                  <Button
                    type="submit" 
                    className="bg-app-theme! px-6! py-2.5! text-white! rounded-lg! text-sm! font-medium! items-center!"
                    disabled={isUpdate}
                    sx={{ textTransform: 'none' }}
                  >
                    {isUpdate ? (
                      <>
                        Saving...
                        <svg className="h-4 w-4 animate-spin ml-4!" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <ConfirmModal 
        isOpen={isDisconnectModalOpen}
        onClose={() => setIsDisconnectModalOpen(false)}
        onConfirm={processDisconnectGoogle}
        title="Disconnect Google Calendar?"
        message="Are you sure you want to disconnect? The chatbot will no longer be able to sync bookings to your calendar."
        confirmText="Yes, Disconnect"
        cancelText="Cancel"
        type="danger"
        isLoading={isDisconnecting}
      />
    </div>
  );
};

export default GeneralSettings;