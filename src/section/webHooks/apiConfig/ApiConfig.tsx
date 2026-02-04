"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import FormInputProps from "@/components/fieldProp/FormInputProps";
import { FieldConfig } from "@/components/fieldProp/fieldConfig";
import { fetchUserRequest, updateUserRequest } from "@/redux/reducers/user/actions";
import { getUpdateUserPendingSelector, getUserSelector } from "@/redux/reducers/user/selectors";
import WhatsAppWelcomeCard from "@/components/whatsApp/WhatsAppWelcomeCard";

export const metadata: Metadata = {
  title: "All Bots | NimbleMeet AI WhatsApp Chatbot",
  description:
    "View and manage all your AI-powered bots in NimbleMeet. Monitor automated WhatsApp conversations, streamline bookings, and enhance customer engagement from one dashboard.",
};

interface FormData {
    accesstoken: string;
    phonenumberid: string;
}

interface UserUpdates {
    sucess: boolean;
    message: string;
}

const ApiConfig = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [isFetching, setIsFetching] = useState(true);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isload, setIsLoad] = useState(true);
    const fields = FieldConfig.find((sec) => sec.section === "apiconfig")?.fields || [];
    const currentUser = useSelector(getUserSelector);
    const pendingStatus:any = useSelector(getUpdateUserPendingSelector);
    const userData = currentUser?.data || {};
    const userUpdate = currentUser?.userResponse?.user || {};

    const initialValues = useMemo<FormData>(
        () => ({
            accesstoken: userData?.accesstoken || "",
            phonenumberid: userData?.phonenumberid || "",
        }),
        [userData]
    );

    const validationSchema = Yup.object({
        accesstoken: Yup.string().required("Access Token is required"),
        phonenumberid: Yup.string().required("Phone Number ID is required"),
    });

    useEffect(() => {
        setIsFetching(pendingStatus.fetch);
    }, [pendingStatus.fetch]);

    useEffect(() => {
        const loadData = async () => {
            setIsFetching(true);
            dispatch(fetchUserRequest());
            setIsFetching(false);
        };
        loadData();
    }, [dispatch]);

    const handleSubmit = useCallback (
        
        async (values?: FormData, userUpdate?: UserUpdates) => {
            setIsUpdate(true);
            setIsLoad(false);
            setTimeout(async () => {
                await dispatch(updateUserRequest(values)); 
                setIsUpdate(false);
                setIsLoad(true);
            }, 1500);
        },
        [dispatch]
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
            <PageBreadcrumb pagePath="API Config" />
            <div className="space-y-6">
                <div className="rounded-md shadow-xl backdrop-blur-sm bg-white dark:border-color-primary dark:bg-white/[0.03]">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center px-6 py-5">
                        <h3 className="text-base font-medium text-color-primary dark:text-white/90">
                            API Configuration
                        </h3>
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-color-primary sm:p-6">
                        <div className="mx-auto overflow-hidden bg-white dark:border-white/[0.05] dark:bg-white/[0.03] sm:p-6">
                            <WhatsAppWelcomeCard 
                                title="Service Connector"
                                description="Generate a verification token to send and receive messages and view webhook events in real time."
                                buttonText="API Setup"
                                href="/generate-token"
                            />
                            <h3 className="mb-2 text-base font-medium text-color-primary dark:text-white/90">Integrations</h3>
                            <p className="text-color-primary-light dark:text-color-primary-light font-light mb-8">
                                To enable chatbot communication through WhatsApp using Meta’s Business API, you must integrate your Access
                                Token and Phone Number ID for secure and verified messaging.
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://developers.facebook.com/docs/whatsapp/cloud-api"
                                    className="text-color-primary underline hover:no-underline font-medium"
                                    >
                                    Learn more
                                </a>
                            </p>
                            <Formik
                                initialValues={initialValues}
                                enableReinitialize
                                validationSchema={validationSchema}
                                onSubmit={(values) => handleSubmit(values, userUpdate)}
                            >
                                <Form>
                                    {fields.map((field) => (
                                        <FormInputProps key={field.name} Config={field} />
                                    ))}
                                    <Button
                                        type="submit" 
										className="bg-app-theme! px-6! py-2.5! text-white! rounded-lg! text-sm! font-medium! items-center!"
										disabled={isUpdate}
										sx={{ textTransform: 'none', float: 'right' }}
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
                                </Form>
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiConfig;













