import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import AuthProvider from './AuthProvider';
import ReduxProvider from './ReduxProvider';
import { GoogleProviders } from './googleProvider';
import { headers } from "next/headers";

const outfit = Outfit({
  subsets: ["latin"],
});

export default   async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList:any = headers();
  const theme = headersList.get("x-theme") || "light";
  return (
    <html lang="en"  className={theme}>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ReduxProvider>
          <AuthProvider>
            <ThemeProvider>
              <ToastContainer theme={theme}/>
                <SidebarProvider>
                  <GoogleProviders>
                    {children}
                  </GoogleProviders>
                </SidebarProvider>
            </ThemeProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
