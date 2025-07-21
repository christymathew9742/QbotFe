// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   IconButton,
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import SearchIcon from '@mui/icons-material/Search';
// import Switch from "@/components/form/switch/Switch";
// import Select from "@/components/form/Select";
// import Input from "@/components/form/input/InputField"
// import TablePagination from '@mui/material/TablePagination';
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid';
// import { 
//   getBotSelector, 
//   getAllPending,
//   getPostPendingSelector, 
//   getUpdatePendingSelector, 
//   getDeletePendingSelector  
// } from "@/redux/reducers/chatBot/selectors";
// import { 
//   deleteBotRequest, 
//   fetchBotRequest, 
//   updateBotRequest 
// } from "@/redux/reducers/chatBot/actions";
// import Link from "next/link";
// import { toast } from "react-toastify";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import { Metadata } from "next";
// import { 
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { EditIcon, DeleteIcon } from "@/icons";
// import Badge from "@/components/ui/badge/Badge";
// import { customInputStyles } from "@/components/fieldProp/fieldPropsStyles";


// export const metadata: Metadata = {
//   title: "List all Qbot",
//   description:
//     "This is the Qbot listing page",
// };

// interface Bot {
//   _id: number;
//   title:string;
//   status: boolean;
//   updatedAt: string;
//   user:string;
// }

// const WhatsappUser = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const botData = useSelector(getBotSelector);
//   const spanRef:any = useRef(null);
//   const [isWider, setIsWider] = useState(false);
//   const [page, setPage] = useState(1);
//   const pendingStatus = useSelector(getAllPending)
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState<string | null>(null);
//   const [activeBots, setActiveBots] = useState<Record<string, boolean>>({});
//   const [isFetching, setIsFetching] = useState(true);

//   const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
//   const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
//     page: 0,
//     pageSize: 5,
//   });

//   useEffect(() => {
//     const width = spanRef?.current?.offsetWidth;
//     setIsWider(width > 120);
//   }, []);

//   useEffect(() => {
//     fetchBots();
//   }, [page, rowsPerPage, search, status]);

//   const fetchBots = () => {
//     const queryObject = { 
//       search,
//       status,
//       page,
//       limit: rowsPerPage,
//     };
//     const queryString = new URLSearchParams(queryObject as any).toString();
//     dispatch(fetchBotRequest(queryString));
//   };

//   const handleDelete = useCallback(
//     async (id: any, title: string) => {
//       setIsFetching(false);
//       try {
//         await dispatch(deleteBotRequest(id));
//         if (!pendingStatus?.update) {
//           setTimeout(() => {
//             fetchBots();
//           }, 200);
//           toast.success(`${title} deleted successfully`);
//         }
//       } catch (error) {
//         console.log("Error in deleting ChatBot:", error);
//         toast.error(`Error in deleting ${title}`);
//       }
//     },
//     [dispatch, fetchBots, pendingStatus?.update]
//   );

//   const handleChangePage = (
//     event: React.MouseEvent<HTMLButtonElement> | null,
//     newPage: number
//   ) => {
//     setPage(newPage + 1);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(1);
//   };

//   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setIsFetching(true);
//     setSearch(event.target.value);
//     setPage(1);
//   };

//   const handleStatusChange = (value: any) => {
//     setIsFetching(true);
//     setStatus(value as string | null);
//     setPage(1);
//   };

//   useEffect(() => {
//     if (botData?.data?.length) {
//       const initialState: Record<string, boolean> = {};
//       botData.data.forEach((bot: Bot) => {
//         initialState[bot._id] = bot?.status ?? true; 
//       });
//       setActiveBots(initialState);
//     }
//   }, [botData]);

//   const handleSwitchChange = useCallback(
//     async (bot: any, checked: boolean) => {
//       setIsFetching(false);
//       const updatedBot = {
//         ...bot,
//         status: checked,
//       };
//       setActiveBots((prev) => ({
//         ...prev,
//         [bot._id]: checked,
//       }));
  
//       try {
//         await dispatch(updateBotRequest({ id: bot._id, payload: updatedBot }));
  
//         setTimeout(() => {
//           if (status !== "") {
//             fetchBots();
//           }
//         }, 250);
//       } catch (error) {
//         console.error("Update failed:", error);
//       }
//     },
//     [dispatch, fetchBots, status, pendingStatus]
//   );
  
//   const options = [
//     { value: "", label: "All" },
//     { value: "true", label: "Enabled" },
//     { value: "false", label: "Disabled" },
//   ];

//   const userDataTable = [
//     {
//       _id: '123',
//       title: 'Christy',
//       status: true,
//       updatedAt: '2025-05-23',
//       user:'1',
//       rate:'8',
//       type:'New ',
//       appoimentTypes:'Healthcare',
//     },
//     {
//       _id: '12q3',
//       title: 'Ananthu kumar chakkaravari',
//       status: false,
//       updatedAt: '2025-05-23',
//       user:'6',
//       rate:'7',
//       type:'Frequent',
//       appoimentTypes:'Wellness',
//     },
//     {
//       _id: '12s3',
//       title: 'Arun  Pawlose',
//       status: true,
//       updatedAt: '2025-05-23',
//       user:'8',
//       rate:'2',
//       type:'Inactive',
//       appoimentTypes:'Business',
//     },
//     {
//       _id: '12s3d',
//       title: 'Manu',
//       status: false,
//       updatedAt: '2025-05-23',
//       user:'8',
//       rate:'2',
//       type:'No show',
//       appoimentTypes:'Education',
//     },
//     {
//       _id: '12sss3d',
//       title: 'Laly',
//       status: false,
//       updatedAt: '2025-05-230',
//       user:'8',
//       rate:'2',
//       type:'No show',
//       appoimentTypes:'Others',
//     },
//   ];

//   const tableHeadings = [
//     "Name",
//     "Interaction Status",
//     "Appointments Count",
//     "Sentiment Score",
//     "User Type",
//     "Appointments Type",
//     "Last Visit",
//     "Action",
//   ];

//   const userType = (type: string) => {
//     switch (type) {
//       case 'New': return "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400";
//       case 'Frequent': return "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400";
//       case 'Inactive': return "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400";
//       case 'No show': return "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
//       default: return 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500';
//     }
//   };

//   const InteractionType = (type: string) => {
//     switch (type.toString()) {
//       case 'true': return "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500";
//       case 'false': return "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const sentimentScore = (type: string) => {
//     const score = Number(type);
//     return score > 7
//       ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
//       : score <= 7 && score > 4
//       ? "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400"
//       : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
//   };
  
//   const columns: GridColDef[] = [
//     { 
//       field: 'title', 
//       headerName: 'Name', 
//       flex: 2,
//       renderCell: (params) => (
//         <div className="flex items-center gap-3 mt-1">
//           <div className="!w-10 h-10 rounded-full bg-[#5ca1258a] flex items-center justify-center text-white font-medium text-[16px] shadow-md dark:bg-[#5ca1252e]">
//             {params.value?.charAt(0).toUpperCase()}
//           </div>
//           <div>
//             <span ref={spanRef} title={isWider && params.value || ''} className="block truncate w-[120px] font-medium text-gray-800 text-theme-sm dark:text-white/90">
//               {params.value}
//             </span>
//             <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
//             📞 +918089217
//             </span>
//           </div>
//         </div>
//       ),
//     },
//     { 
//       field: 'status', 
//       headerName: 'Interaction Status', 
//       flex: 1, 
//       type: 'boolean', 
//       renderCell: (params) => (
//         <span className={`text-xxxs px-2 py-1 rounded-full font-medium block  w-[100px] text-center ${InteractionType(params.value)}`}>
//           {params.value ? 'Active' : 'Blocked'}
//         </span>
//       ),
//     },
//     { 
//       field: 'user', 
//       headerName: 'Appointments Count', 
//       flex: 1,
//       renderCell: (params) => (
//         <span className={`text-xxxs px-2 py-1 rounded-full font-medium  text-center bg-gray-100 text-gray-800`}>
//           {params.value}
//         </span>
//       ),
//     },
//     { 
//       field: 'rate', 
//       headerName: 
//       'Sentiment Score',
//       flex: 1,
//       renderCell: (params) => (
//         <span className={`text-xxxs px-2 py-1 rounded-full font-medium  text-center ${sentimentScore(params.value)}`}>
//           {params.value}
//         </span>
//       ),
//     },
//     { 
//       field: 'type', 
//       headerName: 'User Type', 
//       flex: 1, 
//       type: 'boolean', 
//       renderCell: (params) => (
//         <span className={`text-xxxs px-2 py-1 rounded-full font-medium block w-[100px] text-center ${userType(params.value)}`}>
//           {params.value}
//         </span>
//       ),
//     },
//     { 
//       field: 'appoimentTypes', 
//       headerName: 'Appointments Type', 
//       flex: 1, 
//       type: 'boolean', 
//       renderCell: (params) => (
//         <span className={`text-xxxs px-2 py-1 rounded-full font-medium block w-[100px] text-center !bg-purple-100 text-purple-800`}>
//           {params.value}
//         </span>
//       ),
//     },
//     { 
//       field: 'updatedAt', 
//       headerName: 'Last Visit', 
//       flex: 1,
//       renderCell: (params) => (
//         <span className={`text-xxxs px-2 py-1`}>
//           {params.value}
//         </span>
//       ),
//     },
//   ];
  
//   return (
//     <div>
//       <PageBreadcrumb pagePath="Chatbot"/>
//       <div className="space-y-6 ">
//         <div
//           className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
//         >
//           <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//                 User Details
//               </h3>
//             </div>
//           </div>
//           <div className="p-4 border-t  dark:border-gray-800 sm:p-6">
//             <div className="w-full overflow-x-auto custom-scrollbar max-w-[900px] !rounted-lg mx-auto  border dark:!border-gray-700">
//               <div className="custom-scrollbar overflow-x-auto min-w-[1000px]">
//                 <DataGrid
//                   rows={userDataTable}
//                   columns={columns}
//                   paginationModel={paginationModel}
//                   onPaginationModelChange={setPaginationModel}
//                   pageSizeOptions={[5, 10, 20]}
//                   filterModel={filterModel}
//                   onFilterModelChange={setFilterModel}
//                   getRowId={(row) => row._id}
//                   disableColumnMenu
//                   checkboxSelection={false}
//                   disableRowSelectionOnClick
//                   showToolbar
//                   className="dark:!text-white dark:!bg-[#182332] custom-scrollbar !border-none"
//                   sx={customInputStyles}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* <TablePagination
//           component="div"
//           className="text-amber-50"
//           rowsPerPageOptions={[5, 10, 25]}
//           count={botData?.total || 0}
//           page={page - 1}
//           onPageChange={handleChangePage}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         /> */}
//       </div>
//     </div>
//   );
// };

// export default WhatsappUser;



"use client";

import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: "List all Qbot",
  description:
    "This is the Qbot listing page",
};


const WhatsappUser = () => {
 
  
    return (
        <div>
            <PageBreadcrumb pagePath="Chatbot"/>
            <div className="space-y-6 ">
                <div
                    className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
                >
                    <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                User Details
                            </h3>
                        </div>
                    </div>
                    <div className="p-4 border-t  dark:border-gray-800 sm:p-6">
                        <div className="w-full overflow-x-auto custom-scrollbar max-w-[900px] !rounted-lg mx-auto  border dark:!border-gray-700">
                            <div className="custom-scrollbar overflow-x-auto min-w-[1000px]">
                               hiii
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatsappUser;

































