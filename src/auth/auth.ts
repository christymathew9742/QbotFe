import axios from 'axios';
import { EventEmitter } from 'events';
import Cookies from 'universal-cookie';
import { baseURL } from '@/utils/url';

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
        clBk(response?.data,null);
      } else {
        clBk('No token found', null);
      }
    } catch (error:any) {
      console.warn('Login error:', error);
      clBk(null,error);
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
      cBack(null, response.data);
    } catch (error:any) {
      console.warn('Registration error:', error);
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
  try {
    await Auth.login(values, clbk);
  } catch (error:any) {
    console.error('Login error:', error);
  }
}

export async function signUpV2(values: any, clbk: Function) {
  if (!Auth) {
    console.error("Auth is not initialized. Make sure `configure` is called first.");
    return;
  }
  const { username, email, password, confirmPassword } = values;
  try {
    await Auth.register({ username, email, password, confirmPassword }, clbk);
  } catch (error:any) {
    console.error('Registration error:', error);
  }
}

export const signOut = async () => {
  try {
      cookies.remove('accessToken');
      console.log('User logged out successfully');
  } catch (error) {
      console.error('Error logging out:', error);
  }
};


// import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
// import { EventEmitter } from 'events';
// import Cookies from 'universal-cookie';
// import { baseURL } from '@/utils/url';
// import { toast } from "react-toastify";

// interface CallbackType {
//   (error: any, data: any): void;
// }

// let Auth: CommonAuth | null = null;
// const cookies = new Cookies();

// class CommonAuth extends EventEmitter {
//   appId: string;
//   constructor(appId: string) {
//     super();
//     this.appId = appId;
//   }

//   async currentSession() {
//     const token = cookies.get('accessToken');
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       return token;
//     }
//     return null;
//   }

//   async login(
//     { email, password }: { email: string; password: string },
//     clBk: CallbackType
//   ) {
//     // Remove Authorization header to avoid interference with login
//     delete axios.defaults.headers.common['Authorization'];

//     const data = JSON.stringify({ email, password });
//     const config: AxiosRequestConfig = {
//       method: 'post',
//       url: `${baseURL}/auth/login`,
//       headers: {
//         app: this.appId,
//         'Content-Type': 'application/json',
//       },
//       data,
//     };

//     try {
//       const response = await axios(config);
//       const success = response.data?.success;
//       const token = response.data?.data?.token;

//       if (success && token) {
//         await setToken(token);
//         this.emit('login', { accessToken: token });
//         clBk(response.data,null);
//       } else {
//         clBk('Login failed: No token found', null);
//       }
//     } catch (error: any) {
//       console.error('Login error:', error);
//       clBk(null,error);
//     }
//   }

//   async register(
//     {
//       username,
//       email,
//       password,
//       confirmPassword,
//     }: { username: string; email: string; password: string; confirmPassword: string },
//     cBack: CallbackType
//   ) {
//     // Remove Authorization header to avoid interference with signup
//     delete axios.defaults.headers.common['Authorization'];

//     const data = JSON.stringify({ username, email, password, confirmPassword });
//     const config: AxiosRequestConfig = {
//       method: 'post',
//       url: `${baseURL}/auth/signup`,
//       headers: {
//         app: this.appId,
//         'Content-Type': 'application/json',
//       },
//       data,
//     };

//     try {
//       const response = await axios(config);
//       console.log('Registration response:', response.data);
//       cBack(null, response.data);
//     } catch (error: any) {
//       console.error('Registration error:', error);
//       cBack(error, null);
//     }
//   }
// }

// const setToken = async (token: string) => {
//   cookies.set('accessToken', token);
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   localStorage.setItem('userLoggedIn', 'true');
// };

// export async function configure(appId: string, createSession: Function) {
//   if (!Auth) {
//     Auth = new CommonAuth(appId);
//     const token: any = await Auth.currentSession();
//     if (token) {
//       await setToken(token);
//       createSession(token);
//     }
//     Auth.on('login', async (data: any) => {
//       await setToken(data?.accessToken);
//       createSession(data?.accessToken);
//     });
//   }
// }

// export async function loginV2(values: any, clbk: CallbackType) {
//   if (!Auth) {
//     console.error("Auth is not initialized. Make sure `configure` is called first.");
//     return;
//   }
//   try {
//     await Auth.login(values, clbk);
//   } catch (error: any) {
//     console.error('Login error:', error);
//     clbk(error, null);
//   }
// }

// export async function signUpV2(values: any, clbk: CallbackType) {
//   if (!Auth) {
//     console.error("Auth is not initialized. Make sure `configure` is called first.");
//     return;
//   }
//   const { username, email, password, confirmPassword } = values;
//   try {
//     await Auth.register({ username, email, password, confirmPassword }, clbk);
//   } catch (error: any) {
//     console.error('Registration error:', error);
//     clbk(error, null);
//   }
// }

// export const signOut = async () => {
//   try {
//     cookies.remove('accessToken');
//     localStorage.removeItem('userLoggedIn');
//     delete axios.defaults.headers.common['Authorization'];
//     console.log('User logged out successfully');
//   } catch (error) {
//     console.error('Error logging out:', error);
//   }
// };






