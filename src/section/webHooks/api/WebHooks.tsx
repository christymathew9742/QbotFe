"use client";

import React, { useCallback, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CopyField from "@/components/form/CopyField/CopyField";
import { baseURL } from "@/utils/url";
import { getUserSelector, getUpdateUserPendingSelector } from "@/redux/reducers/user/selectors";
import { fetchUserRequest, updateUserRequest } from "@/redux/reducers/user/actions";

const WebHooks = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isUpdate, setIsUpdate] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const currentUser = useSelector(getUserSelector);
    const pendingStatus:any = useSelector(getUpdateUserPendingSelector);
    const userData = currentUser?.data || {};

    useEffect(() => {
        setIsFetching(pendingStatus.fetch);
    }, [pendingStatus.fetch]);
    
    const generateToken = useCallback(() => {
        setIsFetching(false)
        setIsUpdate(true);
        setTimeout(async () => {
            await dispatch(updateUserRequest({ generateToken: true }));
            setIsUpdate(false);
        }, 1500);
        dispatch(fetchUserRequest())
    }, [dispatch]);

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb pagePath="API Setup" />
            <div className="space-y-6">
                <div className="rounded-md shadow-xl backdrop-blur-sm bg-white dark:border-color-primary dark:bg-white/[0.03]">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center px-6 py-5">
                        <h3 className="text-base font-medium text-color-primary dark:text-white/90">
                        API Setup
                        </h3>
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-color-primary sm:p-6">
                        <div className="mx-auto overflow-hidden bg-white dark:border-white/[0.05] dark:bg-white/[0.03] sm:p-6">
                            <h3 className="mb-2 text-base font-medium text-color-primary dark:text-white/90">
                                Webhook
                            </h3>
                            <p className="text-color-primary-light dark:text-color-primary-light font-light mb-8">
                                To connect your chatbot app with WhatsApp, set up your Webhook Callback URL and generate an API key. This enables message delivery and status updates through the Meta Developer Platform.
                                <a
                                target="_blank"
                                rel="noreferrer"
                                href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started#configure-webhooks"
                                className="text-color-primary underline hover:no-underline font-medium"
                                >
                                Learn more
                                </a>
                            </p>

                            <CopyField
                                id="callBack-key"
                                label="Call Back URL:"
                                value={`${baseURL}/whatsapp/webhook`}
                                title="This is the URL Meta will send you events."
                                disabled
                                type="password"
                            />

                            <CopyField
                                id="api-key"
                                label="API Key:"
                                value={userData?.verifytoken || ""}
                                title="This is your API Key and Verification Token, used to authenticate your WhatsApp Chat Bot connections."
                                onClick={generateToken}
                                disabled
                                update={isUpdate}
                                type="password"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebHooks;












