"use client";

import React, { useCallback, useMemo } from "react";

import { LoginOutlined } from "@mui/icons-material";

import { Typography, Button, CircularProgress, Grid } from "@mui/material";
import { parseCookies } from "nookies";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { loginV2 } from "@/auth/auth";
import { FieldProps } from "@/components/fieldProps";
import { FieldConfig } from "@/components/fieldProps/fieldConfig";

interface LoginValues {
    email: string;
    password: string;
}

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

const SignIn: React.FC = () => {
    const router = useRouter();
    const initialValues = useMemo<LoginValues>(() => ({
            email: "",
            password: "",
    }), []);

    const onSubmit = useCallback (
        debounce(async (values: LoginValues, { resetForm }: FormikHelpers<LoginValues>) => {
            try {
                await loginV2(values, (data: any, err: any) => {
                    if (data) {
                        console.error("Login error:", data);
                    } else {
                        router.push("/dashboard");
                    }
                });
                resetForm();
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        },  1000),
    [router]);

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
                <Form>
                    <Grid container spacing={2} mb={2} className="w-full">
                        <h1 className="w-full text-center text-letter-theme-clr mb-4 text-[clamp(2.2rem,10vw,2.3rem)] font-semibold">
                            Sign In
                        </h1>
                        {Object.keys(initialValues).map((key) => (
                            <FieldProps key={key} Config={FieldConfig[key as keyof LoginValues]} />
                        ))}
                    </Grid>
                    <Grid container justifyContent="center">
                        <button 
                            type="submit" 
                            className="flex items-center justify-center w-full sm:w-auto bg-gradient-to-r  from-custom-blue-left to-custom-blue-right text-white py-2 px-6 rounded-md hover:opacity-90 transition-all bg-highlight-clr"
                        >
                            {isSubmitting ? <>Sign In...  <CircularProgress size={20} className="mr-2 text-white"/></> : <>Sign In  <LoginOutlined className="w-5 h-5 ml-2" /></>}
                        </button>
                    </Grid>
                </Form>
            )}
        </Formik>
    );};

export default SignIn;

