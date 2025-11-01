import axios, { AxiosError } from 'axios';
import { EventEmitter } from 'events';
import Cookies from 'universal-cookie';
import { baseURL } from '@/utils/url';

const cookies = new Cookies();

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface GooglePayload {
  token: string;
}

interface ForgotPasswordPayload {
  emailOrPhone: unknown;
}

interface SendOTP {
  message:string;
  error?:string;
  success?:boolean;
  userId?:any;
}

interface VerifyOTPPayload {
  emailOrPhone: string;
  otp: string;
  success: boolean; 
}

interface ResetPasswordPayload {
  emailOrPhone: unknown;
  newPassword?: string;
  password?: string;
  userId?:any;
}

type Callback<T = unknown> = (error: string | null, result: T | null) => void;

interface LoginResponse {
  data: {
    token: string;
    [key: string]: unknown;
  };
  message: string;
}

interface RegisterResponse {
  data: unknown;
  message: string;
  [key: string]: unknown;
}

let Auth: CommonAuth | null = null;

class CommonAuth extends EventEmitter {
  appId: string;

  constructor(appId: string) {
    super();
    this.appId = appId;
  }

  async currentSession(): Promise<string | null> {
    const token = cookies.get('accessToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return token;
    }
    return null;
  }

  async login(payload: LoginPayload, callback: Callback<LoginResponse>): Promise<void> {
    const config = {
      method: 'post',
      url: `${baseURL}/auth/login`,
      headers: {
        app: this.appId,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(payload),
    };

    try {
      const response = await axios(config);
      const token = response.data?.data?.token;
      if (token) {
        await setToken(token);
        this.emit('login', { accessToken: token });
        callback(null, response.data);
      } else {
        callback('No token found', null);
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
      console.warn('Login error:', error);
      callback(errorMessage, null);
    }
  }

  async register(payload: RegisterPayload, callback: Callback<RegisterResponse>): Promise<void> {
    const config = {
      method: 'post',
      url: `${baseURL}/auth/signup`,
      headers: {
        app: this.appId,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(payload),
    };

    try {
      const response = await axios(config);
      callback(null, response.data);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
      console.warn('Registration error:', error);
      callback(errorMessage, null);
    }
  }

  async googleLogin(payload: GooglePayload, callback: Callback<LoginResponse>): Promise<void> {
    const config = {
      method: 'post',
      url: `${baseURL}/auth/google-login`,
      headers: {
        app: this.appId,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(payload),
    };

    try {
      const response = await axios(config);
      const token = response.data?.data?.token;
      if (token) {
        await setToken(token);
        this.emit('login', { accessToken: token });
        callback(null, response?.data);
      } else {
        callback('No token found', null);
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
      console.error('Google login failed:', error);
      callback(errorMessage, null);
    }
  }

  async sendOTP(payload: ForgotPasswordPayload, callback: Callback<SendOTP>): Promise<void> {
    try {
      const response = await axios.post(`${baseURL}/auth/forgot-password`, payload, {
        headers: { app: this.appId },
      });
      callback(null, response.data);
    } catch (error: unknown) {
      const err = error as AxiosError<SendOTP>;
      console.log( err.response?.data,' response.data')
      const errorMessage = err.response?.data?.message || err.message || 'OTP send failed';
      console.warn('sendOTP failed:', error);
      callback(errorMessage, null);
    }
  }

  async verifyOTP(payload: VerifyOTPPayload, callback: Callback<SendOTP>): Promise<void> {
    try {
      const response = await axios.post(`${baseURL}/auth/verify-otp`, payload, {
        headers: { app: this.appId },
      });
      callback(null, response.data);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || err.message || 'OTP verification failed';
      console.warn('verifyOTP failed:', error);
      callback(errorMessage, null);
    }
  }

  async resetPassword(payload: ResetPasswordPayload, callback: Callback<SendOTP>): Promise<void> {
    try {
      const response = await axios.post(`${baseURL}/auth/reset-password`, payload, {
        headers: { app: this.appId },
      });
      console.log(response?.data,'response')
      callback(null, response.data);
    } catch (error: unknown) {
      const err = error as AxiosError<SendOTP>;
      const errorMessage = err.response?.data?.message || err.message || 'Reset password failed';
      console.error('resetPassword failed:', error);
      callback(errorMessage, null);
    }
  }
}

const setToken = async (token: string) => {
  cookies.set('accessToken', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('userLoggedIn', 'true');
};

export async function configure(appId: string, createSession: (token: string) => void) {
  if (!Auth) {
    Auth = new CommonAuth(appId);
    const token = await Auth.currentSession();
    if (token) {
      await setToken(token);
      createSession(token);
    }
    Auth.on('login', async (data: { accessToken: string }) => {
      await setToken(data.accessToken);
      createSession(data.accessToken);
    });
  }
}

export async function loginV2(values: LoginPayload, callback: Callback<LoginResponse>) {

  try {
    await Auth?.login(values, callback);
  } catch (error) {
    console.error("Login failed:", error);
  }
  
}

export async function signUpV2(values: RegisterPayload, callback: Callback<RegisterResponse>) {

  try {
    await Auth?.register(values, callback);
  } catch (error) {
    console.error("register failed:", error);
  }
}

export async function googleLoginV2(token: string, callback: Callback<LoginResponse>) {

  try {
    await Auth?.googleLogin({ token }, callback);
  } catch (error) {
    console.error("register failed:", error);
  }
  
}

export async function sendOTPV2(payload: ForgotPasswordPayload, callback: Callback<SendOTP>) {

  try {
    await Auth?.sendOTP(payload, callback);
  } catch (error) {
    console.error("register failed:", error);
  }
}

export async function verifyOTPV2(payload: VerifyOTPPayload, callback: Callback<SendOTP>) {
 
  try {
    await Auth?.verifyOTP(payload, callback);
  } catch (error) {
    console.error("register failed:", error);
  }
}

export async function resetPasswordV2(payload: ResetPasswordPayload, callback: Callback<SendOTP>) {
  
  try {
    await Auth?.resetPassword(payload, callback);
  } catch (error) {
    console.error("register failed:", error);
  }
}

export const signOut = async () => {
  
  try {
    cookies.remove('accessToken');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};



