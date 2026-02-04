"use client";

import React, { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { parseCookies } from 'nookies';
import { CircularProgress, Grid } from "@mui/material";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { loginV2 } from "@/auth/auth";
import FormInputProps from "@/components/fieldProp/FormInputProps";
import { FieldConfig } from "@/components/fieldProp/fieldConfig";
import Link from "next/link";

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
  const { accessToken } = parseCookies();
  const initialValues = 
    useMemo<LoginValues>(() => ({
      email: "",
      password: "",
    }), []);

  const onSubmit = useCallback(
    debounce(
      async (values: LoginValues, { resetForm }: FormikHelpers<LoginValues>) => {
        if (!navigator.onLine) {
          toast.error("No internet connection. Please check your network.");
          resetForm();
          return;
        }
        try {
          console.log(values,'valuesvalues')
          await loginV2(values, (err) => {
            if (err) {
              toast.error(err || "Something went wrong");
            } else {
              router.push("/");
            }
          });
          resetForm();
        } catch (error: any) {
          if (error.message === "Network Error") {
            toast.error("Network error. Please check your internet connection.");
          } else {
            toast.error("Login failed.");
          }
          resetForm();
          console.warn("Error submitting form:", error);
        }
      },
      1000
    ),
    [accessToken]
  );
  
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form className="sm:mt-20">
          <Grid container spacing={2} mb={2} className="w-full">
              <h1 className="w-full text-center mb-4 text-[clamp(2.2rem,10vw,2.3rem)] font-semibold text-app-theme ">
                  Sign In
              </h1>
              {FieldConfig?.find(sec => sec.section === 'signin')?.fields.map((field) => (
                <FormInputProps key={field.name} Config={field} />
              ))}
          </Grid>
          <Grid container>
            <div className="float-left w-full">
              <Link
                href="/reset-password"
                className="text-xxm text-app-theme  hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </Link>
            </div>
            <div className="mt-5 w-full">
              <button 
                  type="submit" 
                  className="flex items-center justify-center w-full  bg-app-theme   from-custom-blue-left to-custom-blue-right text-white py-2 px-6 rounded-md hover:opacity-90 transition-all"
              >
                  {isSubmitting ? <>Sign In...  <CircularProgress size={20} className="mr-2 text-white"/></> : <>Sign In </>}
              </button>
            </div>
            <div className="mt-4 w-full">
              <p className="text-center mb-4 text-app-theme  font-medium text-[14px]">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-app-theme  hover:opacity-90 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </Grid>
        </Form>
      )}
    </Formik>
  );};

export default SignIn;


