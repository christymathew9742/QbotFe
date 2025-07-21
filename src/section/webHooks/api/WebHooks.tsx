"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
//   IconButton,
  CircularProgress,
  TextField,
} from "@mui/material";
// import SearchIcon from '@mui/icons-material/Search';
// import Switch from "@/components/form/switch/Switch";
// import Select from "@/components/form/Select";
// import Input from "@/components/form/input/InputField"
// import TablePagination from '@mui/material/TablePagination';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";

// import Link from "next/link";
// import { toast } from "react-toastify";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
// import { 
//     Table,
//     TableBody,
//     TableCell,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { EditIcon, DeleteIcon } from "@/icons";
import CopyField from "@/components/form/CopyField/CopyField";
import { baseURL } from "@/utils/url";
import Button from "@/components/ui/button/Button";
import FormInputProps from "@/components/fieldProp/FormInputProps";
import { FieldConfig } from "@/components/fieldProp/fieldConfig";
import { getUserSelector, getUpdateUserPendingSelector } from "@/redux/reducers/user/selectors";
import { fetchUserRequest, postUserRequest, updateUserRequest } from "@/redux/reducers/user/actions";

export const metadata: Metadata = {
  title: "List all Qbot",
  description:
    "This is the Qbot listing page",
};

// interface Bot {
//     _id: number;
//     title:string;
//     status: boolean;
//     updatedAt: string;
//     user:string;
// }
interface FormData {
    sendnumber: string;
    sendmessage: string;
}

const WebHooks = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const fields = FieldConfig.find(sec => sec.section === 'testMessage')?.fields || [];
    const currentUser = useSelector(getUserSelector);
    const userUpdatesStatus = useSelector(getUpdateUserPendingSelector);
    const userData = currentUser?.user?.data || {};
    
    console.log(userData,'userDatauserDatauserData')

    useEffect(() => {
        dispatch(fetchUserRequest());
    },[dispatch, userUpdatesStatus]);

    const generateToken = useCallback(() => {
        try {
            setIsUpdate(true);
            setTimeout(async () => {
                await dispatch(updateUserRequest({generateToken:true}));
                setIsUpdate(false)
            }, 1500);
        } catch (error) {
            console.error('Update failed:', error);
        } 
    }, [dispatch]);

    const initialValues:FormData = {
        sendnumber: '',
        sendmessage: '',
    };

    // const initialValues = useMemo<FormData>(() => ({
    //     sendnumber: userData?.sendnumber || '',
    //     sendmessage: userData?.sendmessage || '',
    // }), [dispatch, userData]);
    
    const validationSchema = Yup.object({
        sendmessage: Yup.string().required('Message is required'),
        sendnumber: Yup.string()
            .required('Phone number is required')
            .test('is-valid-phone', 'Invalid phone number or Countycode is missing', function (value) {
            return value ? isValidPhoneNumber(value) : false;
        }),
    });

    const handleSubmit = useCallback(
        (values: FormData) => {
            try {
                setIsUpdate(true);
                setTimeout(async () => {
                    await dispatch(postUserRequest(values));
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
                            API Setup
                        </h3>
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                        <div className="p-4 mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] sm:p-6">
                            <h3 className="mb-2 text-base font-medium text-gray-800 dark:text-white/90">Webhook</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-light mb-8">
                                To connect your chatbot app with WhatsApp, set up your Webhook Callback URL and generate an API key. This enables message delivery and status updates through the Meta Developer Platform. 
                                <a target="_blank" rel="noreferrer" href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started#configure-webhooks" className="text-custom-them-clr underline hover:no-underline font-medium">Learn more</a>
                            </p>
                            <CopyField 
                                id="callBack-key" 
                                label="Call Back URL:" 
                                value={`${baseURL}/whatsapp/webhook`} 
                                title="This is the URL meta will sending you events."
                                disabled={true}
                            />
                            <CopyField 
                                id="api-key" 
                                label="API Key:" 
                                value={userData?.verifytoken || ''} 
                                title="This is your API Key and Verification Token, used to authenticate your WhatsApp Chat Bot connections. These credentials are required to enable communication with WhatsApp. Please note: this key is for demo or trial purposes only and will expire after one day. For full access and continued use, a pro version must be purchased."
                                onClick={generateToken} 
                                disabled={true}
                                update={isUpdate}
                            />
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                        <div className="p-4 mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] sm:p-6">
                            <h3 className="mb-2 text-base font-medium text-gray-800 dark:text-white/90">Test Webhook</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-light mb-8">
                                Once your Webhook is configured, send a test message to verify the connection. This ensures your chatbot is properly receiving and responding to incoming messages from WhatsApp.
                                <a target="_blank" rel="noreferrer" href="https://developers.facebook.com/docs/whatsapp/cloud-api" className="text-custom-them-clr underline hover:no-underline font-medium">Learn more</a>
                            </p>
                            <div className="sm:flex sm:gap-6 flex-col sm:flex-row sm:mt-2">
                                <div className="w-full sm:w-[40%]">
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
                                                className="w-[110px] !py-[11px] float-end mt-3"
                                            >
                                                {isUpdate ? <>Send... <CircularProgress size={20} className="mr-2 !text-white"/></> : <>Send</>}
                                            </Button>
                                        </Form>
                                    </Formik>
                                </div>
                                <div className="w-full sm:w-[60%] mt-20 sm:mt-0">
                                    <TextField  
                                        multiline rows={11} 
                                        spellCheck={false}
                                        autoCorrect="off" 
                                        className={`!bg-gray-50 dark:!bg-gray-700 !text-sm dark:!border-black rounded-2 !rounded-md !w-full !cursor-text`}
                                        value={
                                            currentUser?.error
                                              ? `Error: ${currentUser?.error}${currentUser?.log ? `\nLog:\n${JSON.stringify(currentUser?.log, null, 2)}` : ''}`
                                              : ''
                                        }  
                                        sx={ {
                                            '& .MuiInputBase-input': {
                                                color: `${currentUser?.error ? '#ff0e0e': '#209f20'}`,
                                                fontSize: '12px!important',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                border: '1px solid #cad0d8!important',
                                            },
                                            '.dark & .MuiOutlinedInput-notchedOutline': {
                                                border: `1px solid ${currentUser?.error ? '#660a0a!important' : '#112c4f!important'}`,
                                            },
                                            '.dark & .MuiInputBase-input': {
                                                color: `${currentUser?.error && '#c42b2b'}`,
                                                fontSize: '12px!important',
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebHooks;












