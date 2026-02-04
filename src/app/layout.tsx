import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ToastContainer } from 'react-toastify';
import AuthProvider from './AuthProvider';
import ReduxProvider from './ReduxProvider';
import { GoogleProviders } from './googleProvider';
import { StatusProvider } from '@/context/StatusContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const theme = "light"

  return (
    <html lang="en" className={theme}>
      <body className={`${outfit.className}`}>
        <ReduxProvider>
          <StatusProvider>
            <AuthProvider>
              <ToastContainer 
                toastStyle={{ background: "#fff" }}
                theme={theme} 
              />
              <SidebarProvider>
                <GoogleProviders>
                  {children}
                </GoogleProviders>
              </SidebarProvider>
            </AuthProvider>
          </StatusProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}



