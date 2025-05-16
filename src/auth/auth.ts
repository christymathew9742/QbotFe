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

type Callback<T = unknown> = (error: string | null, result: T | null) => void;

interface LoginResponse {
  data: {
    token: string;
    [key: string]: unknown;
  };
}

interface RegisterResponse {
  data: any;
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
    const data = JSON.stringify(payload);
    const config = {
      method: 'post',
      url: `${baseURL}/auth/login`,
      headers: {
        app: this.appId,
        'Content-Type': 'application/json',
      },
      data,
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
    const data = JSON.stringify(payload);
    const config = {
      method: 'post',
      url: `${baseURL}/auth/signup`,
      headers: {
        app: this.appId,
        'Content-Type': 'application/json',
      },
      data,
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
  if (!Auth) {
    console.error("Auth is not initialized. Make sure `configure` is called first.");
    return;
  }
  await Auth.login(values, callback);
}

export async function signUpV2(values: RegisterPayload, callback: Callback<RegisterResponse>) {
  if (!Auth) {
    console.error("Auth is not initialized. Make sure `configure` is called first.");
    return;
  }
  await Auth.register(values, callback);
}

export const signOut = async () => {
  try {
    cookies.remove('accessToken');
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

