
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Typography, Button, CircularProgress, Grid } from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { signUpV2 } from "@/auth/auth";
import { FieldProps } from "@/components/fieldProps";
import { FieldConfig } from "@/components/fieldProps/fieldConfig";
import { LoginOutlined } from "@mui/icons-material";
import { debounce } from "lodash";
import { toast } from "react-toastify";

interface SignUpValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const validationSchema = Yup.object({
    username: Yup.string().required("User name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
});

const SignUp: React.FC = () => {
    const initialValues = useMemo<SignUpValues>(() => ({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    }), []);

const onSubmit = useCallback(
    debounce(async (values: SignUpValues, { resetForm }: FormikHelpers<SignUpValues>) => {
        try {
            await signUpV2(values, (err: any, data: any) => {
            if (err) {
                console.error("Registration error:", err);
                toast.error(err.response.data.message);
            } else {
                resetForm();
                toast.success(data.message);
            }
            });
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }, 1000),
[]);

return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
            <Form>
                <Grid container spacing={2} mb={2}  className="w-full">
                    <h1 className="w-full text-center text-letter-theme-clr mb-4 text-[clamp(2.2rem,10vw,2.3rem)] font-semibold">
                        Sign Up
                    </h1>
                    {Object.keys(initialValues).map((key) => (
                        <FieldProps key={key} Config={FieldConfig[key as keyof SignUpValues]} />
                    ))}
                </Grid>
                <Grid container justifyContent="center">
                    <button 
                        type="submit" 
                        className="flex items-center justify-center w-full sm:w-auto bg-gradient-to-r  from-custom-blue-left to-custom-blue-right text-white py-2 px-6 rounded-md hover:opacity-90 transition-all"
                    >
                       {isSubmitting ? <>Sign Up... <CircularProgress size={20} className="mr-2 text-white" /></> : <>Sign Up <LoginOutlined className="w-5 h-5 ml-2" /></>}
                    </button>
                </Grid>
            </Form>
        )}
    </Formik>
);};

export default SignUp;
