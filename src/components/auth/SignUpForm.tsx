'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Grid, Divider } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { signUpV2, googleLoginV2 } from '@/auth/auth';
import FormInputProps from '@/components/fieldProp/FormInputProps';
import { FieldConfig } from '@/components/fieldProp/fieldConfig';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface SignUpValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object({
  username: Yup.string().required('User name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const SignUp: React.FC = () => {
  const initialValues = useMemo<SignUpValues>(() => ({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  }), []);

  const router = useRouter();
  const onSubmit = useCallback(
    debounce(async (values: SignUpValues, { resetForm }: FormikHelpers<SignUpValues>) => {
      try {
        await signUpV2(values, (err, data) => {
          if (err) {
            toast.error(err || 'Something went wrong');
          } else {
            resetForm();
            toast.success(data?.message);
          }
        });
      } catch (error) {
        console.warn('Error submitting form:', error);
        toast.error('Submission failed.');
      }
    }, 1000),
    []
  );

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const token = credentialResponse?.credential;
    if (token) {
      googleLoginV2(token, (error, result) => {
        if (error) {
          toast.error(error || 'Google login failed');
        } else {
          router.push('/');
        }
      });
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form className="sm:mt-20" onClick={(e) => e.stopPropagation()}>
          <Grid container spacing={2} mb={2} className="w-full">
            <h1 className="w-full text-center mb-4 text-[clamp(2.2rem,10vw,2.3rem)] font-semibold text-app-theme ">
              Sign Up
            </h1>

            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google Login Failed')}
              />
            </div>

            <Divider className="text-app-theme!" textAlign="center" sx={{ width: '100%', fontSize: '12px', my: 2 }}>
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
                className="flex items-center justify-center w-full bg-app-theme  text-white py-2 px-6 rounded-md hover:opacity-90 transition-all"
              >
                {isSubmitting ? (
                  <>
                    Sign Up... <CircularProgress size={20} className="ml-2 text-white" />
                  </>
                ) : (
                  <>Sign Up</>
                )}
              </button>
            </div>
            <div className="mt-4 w-full">
              <p className="text-center mb-4 text-app-theme font-medium text-[14px]">
                Do you have an account?{" "}
                <Link href="/signin" className="text-app-theme  hover:opacity-90 dark:text-brand-400">
                  Sign In
                </Link>
              </p>
            </div>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default SignUp;


