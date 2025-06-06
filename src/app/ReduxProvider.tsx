'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import store from '@/redux/store';


interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider = ({ children }: ReduxProviderProps) => (
  <Provider store={store}>{children}</Provider>
);

export default ReduxProvider;
