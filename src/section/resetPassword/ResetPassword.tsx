// 'use client';

// import { useState, FormEvent, ChangeEvent } from 'react';
// import { useRouter } from 'next/navigation';
// import { sendOTPV2, verifyOTPV2, resetPasswordV2 } from '@/auth/auth';
// import { toast } from 'react-toastify';

// type Step = 'email' | 'otp' | 'password';

// const ResetPassword = () => {
//   const [step, setStep] = useState<Step>('email');
//   const [emailOrPhone, setEmailOrPhone] = useState('');
//   const [userId, setUserId] = useState('');
//   const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [verified, setVerified] = useState(false); 
//   const router = useRouter();

//   const handleSendOTP = async () => {
//     if (!emailOrPhone.trim()) return setError('Email or phone is required');
//     setError('');
//     try {
//       await sendOTPV2({ emailOrPhone }, (error, result) => {
//         if (error || !result?.success) {
//           return toast.error(error || 'OTP send failed');
//         }
//         toast.success(result?.message || 'OTP sent');
//         setStep('otp');
//       });
//     } catch (e) {
//       toast.error('Unexpected error occurred');
//     }
//   };

//   const handleVerifyOTP = async () => {
//     const enteredOTP = otp.join('');
//     if (enteredOTP.length !== 6) return setError('Enter valid 6-digit OTP');
//     setError('');

//     try {
//       await verifyOTPV2({ emailOrPhone, otp: enteredOTP, success: true }, (error, result) => {
//         if (error || !result?.success) {
//           return toast.error(error || 'Invalid OTP');
//         }
//         setUserId(result?.userId);
//         setVerified(true);
//         setStep('password');
//       });
//     } catch (e) {
//       toast.error('Verification failed');
//     }
//   };

//   const handleResetPassword = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!verified || !userId) return setError('Unauthorized reset attempt');
//     if (password !== confirmPassword) return setError('Passwords do not match');
//     if (password.length < 8) return setError('Password must be at least 8 characters');

//     setError('');
//     try {
//       await resetPasswordV2({ emailOrPhone, password, userId }, (error) => {
//         if (error) {
//           return toast.error(error || 'Failed to reset password');
//         }
//         toast.success('Password reset successfully');
//         setTimeout(() => router.push('/login'), 1000);
//       });
//     } catch (e) {
//       toast.error('Unexpected error during reset');
//     }
//   };

//   const handleOtpChange = (value: string, index: number) => {
//     if (/^\d?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//     }
//   };

//   const renderInputField = (
//     type: string,
//     placeholder: string,
//     value: string,
//     onChange: (e: ChangeEvent<HTMLInputElement>) => void
//   ) => (
//     <input
//       type={type}
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       required
//       className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-sm color-primary dark:text-white focus:ring-2 focus:ring-indigo-500"
//     />
//   );

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
//       <div className="w-full max-w-md rounded-2xl bg-white dark:bg-color-primary p-8 shadow-xl space-y-4">
//         {step === 'email' && (
//           <>
//             <h2 className="text-center text-xl font-bold text-color-primary dark:text-white">Reset Password</h2>
//             {renderInputField('text', 'Enter your email or phone', emailOrPhone, (e) => setEmailOrPhone(e.target.value))}
//             {error && <p className="text-sm text-red-600">{error}</p>}
//             <button
//               onClick={handleSendOTP}
//               className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
//             >
//               Send OTP
//             </button>
//           </>
//         )}

//         {step === 'otp' && (
//           <>
//             <h2 className="text-center text-xl font-bold text-color-primary dark:text-white">Enter OTP</h2>
//             <div className="flex justify-center gap-2 mb-2">
//               {otp.map((value, index) => (
//                 <input
//                   key={index}
//                   type="password" 
//                   maxLength={1}
//                   value={value}
//                   onChange={(e) => handleOtpChange(e.target.value, index)}
//                   className="w-10 h-10 text-center rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-lg color-primary dark:text-white focus:ring-2 focus:ring-indigo-500"
//                 />
//               ))}
//             </div>
//             {error && <p className="text-sm text-red-600">{error}</p>}
//             <button
//               onClick={handleVerifyOTP}
//               className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
//             >
//               Verify OTP
//             </button>
//           </>
//         )}

//         {step === 'password' && verified && (
//           <>
//             <h2 className="text-center text-xl font-bold text-color-primary dark:text-white">Set New Password</h2>
//             <form onSubmit={handleResetPassword} className="space-y-3">
//               {renderInputField('password', 'New Password', password, (e) => setPassword(e.target.value))}
//               {renderInputField('password', 'Confirm Password', confirmPassword, (e) => setConfirmPassword(e.target.value))}
//               {error && <p className="text-sm text-red-600">{error}</p>}
//               <button
//                 type="submit"
//                 className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
//               >
//                 Reset Password
//               </button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;



'use client';

import { useState, useRef, FormEvent, ChangeEvent, KeyboardEvent, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOTP = async () => {
    if (!emailOrPhone.trim()) return setError('Email or phone is required');
    setError('');
    setIsLoading(true);
    try {
      await sendOTPV2({ emailOrPhone }, (error, result) => {
        setIsLoading(false);
        if (error || !result?.success) {
          return toast.error(error || 'OTP send failed');
        }
        toast.success(result?.message || 'OTP sent successfully');
        setStep('otp');
      });
    } catch (e) {
      setIsLoading(false);
      toast.error('Unexpected error occurred');
    }
  };

  const handleVerifyOTP = async () => {
    const enteredOTP = otp.join('');
    if (enteredOTP.length !== 6) return setError('Please enter a valid 6-digit OTP');
    setError('');
    setIsLoading(true);

    try {
      await verifyOTPV2({ emailOrPhone, otp: enteredOTP, success: true }, (error, result) => {
        setIsLoading(false);
        if (error || !result?.success) {
          return toast.error(error || 'Invalid OTP');
        }
        setUserId(result?.userId);
        setVerified(true);
        setStep('password');
      });
    } catch (e) {
      setIsLoading(false);
      toast.error('Verification failed');
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!verified || !userId) return setError('Unauthorized reset attempt');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 8) return setError('Password must be at least 8 characters');

    setError('');
    setIsLoading(true);
    try {
      await resetPasswordV2({ emailOrPhone, password, userId }, (error) => {
        setIsLoading(false);
        if (error) {
          return toast.error(error || 'Failed to reset password');
        }
        toast.success('Password reset successfully');
        setTimeout(() => router.push('/login'), 1000);
      });
    } catch (e) {
      setIsLoading(false);
      toast.error('Unexpected error during reset');
    }
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.every(char => !isNaN(Number(char)))) {
      const newOtp = [...otp];
      pastedData.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const renderInputField = (
    type: string,
    placeholder: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    autoFocus = false
  ) => (
    <div className="relative group">
      <input
        type={type}
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        required
        className="peer w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-4 text-sm text-color-primary dark:text-white outline-none transition-all focus:border-app-theme focus:ring-1 focus:ring-app-theme disabled:opacity-50"
      />
    </div>
  );

  const Button = ({ onClick, text, type = 'button' as 'button' | 'submit' }: any) => (
    <button
      onClick={onClick}
      type={type}
      disabled={isLoading}
      className={`w-full transform rounded-lg bg-app-theme px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          Processing...
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </span>
      ) : text}
    </button>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-2xl dark:bg-color-primary-light/10 dark:border dark:border-gray-700 backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-color-primary dark:text-white">
            {step === 'email' && 'Forgot Password?'}
            {step === 'otp' && 'Verify Identity'}
            {step === 'password' && 'Secure Account'}
          </h2>
          <p className="mt-2 text-sm text-color-primary-light dark:text-gray-400">
            {step === 'email' && 'Enter your details to receive a reset code'}
            {step === 'otp' && ( <> Enter the 6-digit code sent to{' '} <b>{emailOrPhone}</b> </>)}
            {step === 'password' && 'Create a strong new password'}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          {step === 'email' && (
            <div className="space-y-5 animate-fadeIn">
              {renderInputField('text', 'Email or Phone Number', emailOrPhone, (e) => setEmailOrPhone(e.target.value), true)}
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button onClick={handleSendOTP} text="Send Verification Code" />
            </div>
          )}
          {step === 'otp' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                {otp.map((value, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-2 border-gray-200 bg-gray-50 text-center text-xl font-bold text-color-primary shadow-sm transition-all focus:border-app-theme focus:bg-white focus:outline-none focus:ring-2 focus:ring-app-theme/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-app-theme"
                  />
                ))}
              </div>
              <div className="text-center">
                 <button 
                   onClick={() => setStep('email')} 
                   className="text-sm font-medium text-app-theme hover:underline"
                 >
                   Wrong number? Go back
                 </button>
              </div>
              {error && <div className="text-center text-sm font-medium text-red-600 dark:text-red-400">{error}</div>}
              <Button onClick={handleVerifyOTP} text="Verify & Proceed" />
            </div>
          )}
          {step === 'password' && verified && (
            <form onSubmit={handleResetPassword} className="space-y-5 animate-fadeIn">
              {renderInputField('password', 'New Password', password, (e) => setPassword(e.target.value), true)}
              {renderInputField('password', 'Confirm New Password', confirmPassword, (e) => setConfirmPassword(e.target.value))}
              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">{error}</div>}
              <Button type="submit" text="Reset Password" />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
