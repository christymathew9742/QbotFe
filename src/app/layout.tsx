import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import AuthProvider from './AuthProvider';
import ReduxProvider from './ReduxProvider';
import { GoogleProviders } from './googleProvider';
import { headers } from "next/headers";
import { StatusProvider } from '@/context/StatusContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // FIXED: Added 'await' because headers() is now a Promise in Next.js 15
  const headersList = await headers();
  const theme = "light" //headersList.get("x-theme") || "light";

  return (
    <html lang="en" className={theme}>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ReduxProvider>
          <StatusProvider>
            <AuthProvider>
              {/* <ThemeProvider> */}
                <ToastContainer 
                  // toastStyle={{ background: theme === "dark" ? "#1d2939" : "#fff" }} 
                  toastStyle={{ background: "#fff" }}
                  theme={theme} 
                />
                <SidebarProvider>
                  <GoogleProviders>
                    {children}
                  </GoogleProviders>
                </SidebarProvider>
              {/* </ThemeProvider> */}
            </AuthProvider>
          </StatusProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}























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
// // import MuiThemeProviderContext from '@/context/ThemeMuiContext';

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
//                       {/* <MuiThemeProviderContext  theme={theme}> */}
//                         {children}
//                       {/* </MuiThemeProviderContext> */}
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



