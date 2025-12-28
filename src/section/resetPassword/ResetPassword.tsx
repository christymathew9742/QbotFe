'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { sendOTPV2, verifyOTPV2, resetPasswordV2 } from '@/auth/auth';
import { toast } from 'react-toastify';

type Step = 'email' | 'otp' | 'password';

const ResetPassword = () => {
  const [step, setStep] = useState<Step>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false); 
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!emailOrPhone.trim()) return setError('Email or phone is required');
    setError('');
    try {
      await sendOTPV2({ emailOrPhone }, (error, result) => {
        if (error || !result?.success) {
          return toast.error(error || 'OTP send failed');
        }
        toast.success(result?.message || 'OTP sent');
        setStep('otp');
      });
    } catch (e) {
      toast.error('Unexpected error occurred');
    }
  };

  const handleVerifyOTP = async () => {
    const enteredOTP = otp.join('');
    if (enteredOTP.length !== 6) return setError('Enter valid 6-digit OTP');
    setError('');

    try {
      await verifyOTPV2({ emailOrPhone, otp: enteredOTP, success: true }, (error, result) => {
        if (error || !result?.success) {
          return toast.error(error || 'Invalid OTP');
        }
        setUserId(result?.userId);
        setVerified(true);
        setStep('password');
      });
    } catch (e) {
      toast.error('Verification failed');
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!verified || !userId) return setError('Unauthorized reset attempt');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 8) return setError('Password must be at least 8 characters');

    setError('');
    try {
      await resetPasswordV2({ emailOrPhone, password, userId }, (error) => {
        if (error) {
          return toast.error(error || 'Failed to reset password');
        }
        toast.success('Password reset successfully');
        setTimeout(() => router.push('/login'), 1000);
      });
    } catch (e) {
      toast.error('Unexpected error during reset');
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const renderInputField = (
    type: string,
    placeholder: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
  ) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-sm color-primary dark:text-white focus:ring-2 focus:ring-indigo-500"
    />
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-color-primary p-8 shadow-xl space-y-4">
        {step === 'email' && (
          <>
            <h2 className="text-center text-xl font-bold text-color-primary dark:text-white">Reset Password</h2>
            {renderInputField('text', 'Enter your email or phone', emailOrPhone, (e) => setEmailOrPhone(e.target.value))}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={handleSendOTP}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <h2 className="text-center text-xl font-bold text-color-primary dark:text-white">Enter OTP</h2>
            <div className="flex justify-center gap-2 mb-2">
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="password" 
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-10 h-10 text-center rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-lg color-primary dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={handleVerifyOTP}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Verify OTP
            </button>
          </>
        )}

        {step === 'password' && verified && (
          <>
            <h2 className="text-center text-xl font-bold text-color-primary dark:text-white">Set New Password</h2>
            <form onSubmit={handleResetPassword} className="space-y-3">
              {renderInputField('password', 'New Password', password, (e) => setPassword(e.target.value))}
              {renderInputField('password', 'Confirm Password', confirmPassword, (e) => setConfirmPassword(e.target.value))}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
