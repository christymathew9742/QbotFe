"use client";

import React, { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
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
  const initialValues = 
    useMemo<LoginValues>(() => ({
      email: "",
      password: "",
    }), []);

  const onSubmit = useCallback (
    debounce(async (values: LoginValues, { resetForm }: FormikHelpers<LoginValues>) => {
      try {
        await loginV2(values, (err) => {
            if (err) {
              toast.error(err|| "Something went wrong");
            } else {
              router.push("/");
            }
        });
        resetForm();
      } catch (error) {
        toast.error("Login failed.");
        console.warn("Error submitting form:", error);
      }
    },  1000),
  [router]);

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form className="sm:mt-20">
          <Grid container spacing={2} mb={2} className="w-full">
              <h1 className="w-full text-center text-letter-theme-clr mb-4 text-[clamp(2.2rem,10vw,2.3rem)] font-semibold text-[#51A1FF]">
                  Sign In
              </h1>
              {Object.keys(initialValues).map((key) => (
                  <FormInputProps key={key} Config={FieldConfig[key as keyof LoginValues]} />
              ))}
          </Grid>
          <Grid container>
            <div className="float-left w-full">
              <Link
                href="/reset-password"
                className="text-[14px] text-[#51A1FF] hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </Link>
            </div>
            <div className="mt-5 w-full">
              <button 
                  type="submit" 
                  className="flex items-center justify-center w-full  bg-[#51A1FF]  from-custom-blue-left to-custom-blue-right text-white py-2 px-6 rounded-md hover:opacity-90 transition-all bg-highlight-clr"
              >
                  {isSubmitting ? <>Sign In...  <CircularProgress size={20} className="mr-2 text-white"/></> : <>Sign In </>}
              </button>
            </div>
            <div className="mt-4 w-full">
              <p className="text-center mb-4 text-[#51A1FF] font-medium text-[14px]">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-[#51A1FF] hover:opacity-90 dark:text-brand-400"
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


