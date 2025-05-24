"use client";

import React, { useCallback, useMemo } from "react";
import { CircularProgress, Grid } from "@mui/material";
import Divider from '@mui/material/Divider';

import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { signUpV2 } from "@/auth/auth";
import FormInputProps  from "@/components/fieldProp/FormInputProps";
import { FieldConfig } from "@/components/fieldProp/fieldConfig";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import Link from "next/link";

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
          await signUpV2(values, (err, data) => {
          if (err) {
              toast.error(err || "Something went wrong");
          } else {
              resetForm();
              toast.success(data?.message);
          }
          });
      } catch (error) {
          console.warn("Error submitting form:", error);
          toast.error("Submission failed.");
      }
    }, 1000),
  []);

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
            <Form className="sm:mt-20">
                <Grid container spacing={2} mb={2}  className="w-full">
                    <h1 className="w-full text-center mb-4 text-[clamp(2.2rem,10vw,2.3rem)] font-semibold text-[#51A1FF]">
                        Sign Up
                    </h1>
                    <div className="w-full">
                      <button className="flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 w-full">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                            fill="#4285F4"
                          />
                          <path
                            d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                            fill="#EB4335"
                          />
                        </svg>
                          Sign up with Google
                      </button>
                      {/* <Button
                        variant="outlined"
                        startIcon={<Google />}
                        sx={{
                          textTransform: 'none',
                          borderColor: '#dadce0',
                          color: 'rgba(0, 0, 0, 0.54)',
                          backgroundColor: '#fff',
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                            borderColor: '#c6c6c6',
                          },
                        }}
                      >
                        Continue with Google
                      </Button> */}

                      
                    </div>
                    <Divider textAlign="center" sx={{ color: 'primary.main', width:'100%', fontSize:'12px'}}>
                      Or
                    </Divider>
                    {FieldConfig?.find(sec => sec.section === 'signup')?.fields.map((field) => (
                      <FormInputProps key={field.name} Config={field} />
                    ))}
                </Grid>
                <Grid container>
                  <div className="mt-5 w-full">
                    <button 
                        type="submit" 
                        className="flex items-center justify-center w-full  bg-[#51A1FF]  from-custom-blue-left to-custom-blue-right text-white py-2 px-6 rounded-md hover:opacity-90 transition-all"
                    >
                        {isSubmitting ? <>Sign Up...  <CircularProgress size={20} className="mr-2 text-white"/></> : <>Sign Up </>}
                    </button>
                  </div>
                  <div className="mt-4 w-full">
                    <p className="text-center mb-4 text-[#51A1FF] font-medium text-[14px]">
                      Do you have an account? {""}
                      <Link
                        href="/signin"
                        className="text-[#51A1FF] hover:opacity-90 dark:text-brand-400"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </Grid>
            </Form>
        )}
    </Formik>
  );};

export default SignUp;

