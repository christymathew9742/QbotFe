import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import AuthProvider from './AuthProvider';
import { headers } from "next/headers";

const outfit = Outfit({
  subsets: ["latin"],
});

export default   async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers(); 
  const theme = headersList.get("x-theme") || "light";
  return (
    <html lang="en"  className={theme === 'dark' ? 'dark' : ''}>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AuthProvider>
          <ThemeProvider>
            <ToastContainer/>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </AuthProvider> 
      </body>
    </html>
  );
}
