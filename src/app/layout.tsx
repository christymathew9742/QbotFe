// import { Outfit } from 'next/font/google';
// import './globals.css';
// import { SidebarProvider } from '@/context/SidebarContext';
// import { ThemeProvider } from '@/context/ThemeContext';
// import { ToastContainer } from 'react-toastify';
// import AuthProvider from './AuthProvider';
// import ReduxProvider from './ReduxProvider';
// import { GoogleProviders } from './googleProvider';
// import { headers } from "next/headers";
// import { StatusProvider } from '@/context/StatusContext';
// import MuiThemeProviderWrapper from './MuiThemeProvider';

// const outfit = Outfit({
//   subsets: ["latin"],
// });

// export default   async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const headersList:any = headers();
//   const theme = headersList.get("x-theme") || "light";

//   return (
//     <html lang="en"  className={theme}>
//       <body className={`${outfit.className} dark:bg-gray-900`}>
//         <ReduxProvider>
//           <StatusProvider>
//             <AuthProvider>
//               <ThemeProvider>
//                 <ToastContainer    toastStyle={{background: theme === "dark" ? "#1d2939" : "#fff" }} theme={theme}/>
//                   <SidebarProvider>
//                     <GoogleProviders>
//                       <MuiThemeProviderWrapper theme={theme}>
//                         {children}
//                       </MuiThemeProviderWrapper>
//                     </GoogleProviders>
//                   </SidebarProvider>
//               </ThemeProvider>
//             </AuthProvider>
//           </StatusProvider>
//         </ReduxProvider>
//       </body>
//     </html>
//   );
// }

import { Outfit } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ClientProviders from "./ClientProviders";

const outfit = Outfit({ subsets: ["latin"] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList: any = headers();
  const theme = headersList.get("x-theme") || "light";

  return (
    <html lang="en" className={theme}>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ClientProviders theme={theme}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}


