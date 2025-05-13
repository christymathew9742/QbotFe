import axios from 'axios';
import { EventEmitter } from 'events';
import Cookies from 'universal-cookie';
import { baseURL } from '@/utils/url';
import { toast } from "react-toastify";

let Auth: CommonAuth | null = null; 
const cookies = new Cookies();

class CommonAuth extends EventEmitter {
  appId: string;
  constructor(appId: string) {
    super();
    this.appId = appId;
  }
  async currentSession() {
    const token = cookies.get('accessToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return token;
    }
    return null;
  }

  async login({ email, password }: { email: string; password: string }, clBk: Function) {
    const data = JSON.stringify({ email, password });
    const config = {
      method: 'post',
      url: `${baseURL}/auth/login`,
      headers: {
        app: this.appId,
        'Content-Type': 'application/json',
      },
      data: data,
    };
  
    try {
      const response = await axios(config);
      const token = response.data?.data?.token;
      if (token) {
        await setToken(token);
        this.emit('login', { accessToken: token });
        console.log('Login successful, token:', token);
        clBk(null, response?.data?.data);
      } else {
        clBk('No token found', null);
      }
    } catch (error) {
      console.log('Login error:', error);
      clBk(error, null);
    }
  }

  async register({ username, email, password, confirmPassword }: { username: string; email: string; password: string; confirmPassword: string }, cBack: Function) {
    const data = JSON.stringify({ username, email, password, confirmPassword });
    const config = {
      method: 'post',
      url: `${baseURL}/auth/signup`,
      headers: {
        app: this.appId,
        'Content-Type': 'application/json',
      },
      data: data,
    };

    try {
      const response = await axios(config);
      console.log('Registration response:', response.data);
      cBack(null, response.data);
    } catch (error:any) {
      console.log('Registration error:', error);
      cBack(error, null);
    }
  }
}

const setToken = async (token: string) => {
  cookies.set('accessToken', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('userLoggedIn', 'true');
};

export async function configure(appId: string, createSession: Function) {
  if (!Auth) {
    Auth = new CommonAuth(appId);
    const token:any = await Auth.currentSession();
    if (token) {
      await setToken(token);
      createSession(token);
    }
    Auth.on('login', async (data: any) => {
      await setToken(data?.accessToken);
      createSession(data?.accessToken);
    });
  }
}

export async function loginV2(values: any, clbk: Function) {
  if (!Auth) {
    console.error("Auth is not initialized. Make sure `configure` is called first.");
    return;
  }
  await Auth.login(values, clbk);
}

export async function signUpV2(values: any, clbk: Function) {
  if (!Auth) {
    console.error("Auth is not initialized. Make sure `configure` is called first.");
    return;
  }
  const { username, email, password, confirmPassword } = values;
  await Auth.register({ username, email, password, confirmPassword }, clbk);
}

export const signOut = async () => {
  try {
      cookies.remove('accessToken');
      console.log('User logged out successfully');
  } catch (error) {
      console.error('Error logging out:', error);
  }
};


