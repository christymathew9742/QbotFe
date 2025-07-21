"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import Button from "@/components/ui/button/Button";
import FormInputProps from "@/components/fieldProp/FormInputProps";
import { FieldConfig } from "@/components/fieldProp/fieldConfig";
import { fetchUserRequest, updateUserRequest } from "@/redux/reducers/user/actions";
import { getUpdateUserPendingSelector, getUserSelector } from "@/redux/reducers/user/selectors";

export const metadata: Metadata = {
  title: "List all Qbot",
  description:
    "This is the Qbot listing page",
};

interface FormData {
    accesstoken: string;
    phonenumberid: string;
}

const ApiConfig = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const fields = FieldConfig.find(sec => sec.section === 'apiconfig')?.fields || [];
    const currentUser = useSelector(getUserSelector);
    const userUpdatesStatus = useSelector(getUpdateUserPendingSelector);
    const userData = currentUser?.user?.data || {};
    console.log(currentUser?.user?.data?.accesstoken,'currentUsercurrentUser')

    const initialValues = useMemo<FormData>(() => ({
        accesstoken: userData?.accesstoken || '',
        phonenumberid: userData?.phonenumberid || '',
    }), [dispatch, userData]);

    const validationSchema = Yup.object({
        accesstoken: Yup.string().required('Access Token is required'),
        phonenumberid: Yup.string().required('Phone Number ID  is required'),
    });

    useEffect(() => {
        dispatch(fetchUserRequest());
    },[dispatch, userUpdatesStatus]);

    // useEffect(() => {
    //     dispatch(fetchUserRequest());
    // },[]);

    const handleSubmit = useCallback(
        (values: FormData) => {
            try {
                setIsUpdate(true);
                setTimeout(async () => {
                    await dispatch(updateUserRequest(values));
                    toast.success('Updated');
                    setIsUpdate(false)
                }, 1500);
            } catch (error) {
                console.error('Update failed:', error);
            } 
        }, 
    [dispatch]);
    
    return (
        <div>
            <PageBreadcrumb pagePath="Token"/>
            <div className="space-y-6">
                <div
                    className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center px-6 py-5">
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                            API Configuration
                        </h3>
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                        <div className="p-4 mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] sm:p-6">
                            <h3 className="mb-2 text-base font-medium text-gray-800 dark:text-white/90">Intagrations</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-light mb-8">
                                To enable chatbot communication through WhatsApp using Meta’s Business API, you must integrate your Access Token and Phone Number ID for secure and verified messaging.
                                <a target="_blank" rel="noreferrer" href="https://developers.facebook.com/docs/whatsapp/cloud-api" className="text-custom-them-clr underline hover:no-underline font-medium">Learn more</a>
                            </p>
                            <div className="sm:flex sm:gap-6 flex-col sm:flex-row sm:mt-2">
                                <div className="w-full">
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        <Form>
                                            {fields.map((field) => (
                                                <FormInputProps key={field.name} Config={field}/>
                                            ))}
                                            <Button
                                                size="sm"
                                                type="submit"
                                                className="w-[150px] !py-[11px] float-end mt-3"
                                            >
                                                {isUpdate ? <>Updating... <CircularProgress size={20} className="mr-2 !text-white"/></> : <>Update</>}
                                            </Button>
                                        </Form>
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiConfig;












