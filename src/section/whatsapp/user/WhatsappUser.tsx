"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IconButton, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { formatUpdatedDate } from "@/utils/utils";
import Input from "@/components/form/input/InputField";
import TablePagination from "@mui/material/TablePagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { View } from "@/icons";
import { getAllPending, getWhatsAppUserSelector } from "@/redux/reducers/user/selectors";
import { fetchWhatsAppUserRequest } from "@/redux/reducers/user/actions";

export const metadata: Metadata = {
  title: "List all Qbot",
  description: "This is the Qbot listing page",
};

interface User {
  _id: number;
  profileName: string;
  status: boolean;
  updatedAt: string;
  user: string;
  statusHistory: any;
  sentimentScores: any;
  createdAt: any;
  statusCounts: number;
  userType: string;
  totalAppointments: string;
  avgSentimentScores: any;
}

const WhatsappUser = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isFetching, setIsFetching] = useState(true);
  const [isload, setIsLoad] = useState(true)

  const whatsAppUser = useSelector(getWhatsAppUserSelector);
  const pendingStatus = useSelector(getAllPending);

  useEffect(() => {
    setIsFetching(pendingStatus.fetch);
  }, [pendingStatus?.fetch]);

  const fetchAppointments = useCallback(() => {
    const query = {
      search,
      page,
      limit: rowsPerPage,
    };

    const queryString = new URLSearchParams(query as any).toString();
    dispatch((fetchWhatsAppUserRequest(queryString)));
  }, [dispatch, search, page, rowsPerPage, isFetching]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setIsLoad(false)
    setPage(newPage + 1);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoad(false)
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  }, []);

  const tableHeadings = useMemo(
    () => ["User Name", "Interaction Speed", "Sentiment Score", "Appointments Count", "User Created", "User Type", "More"],
    []
  );

  const userTypeClass = useCallback((type: string) => {
    switch (type) {
      case "New":
        return "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400";
      case "Engaged ":
        return "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400";
      case "Inactive":
        return "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
      default:
        return "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500";
    }
  }, []);

  const sentimentScoreClass = useCallback((type: string) => {
    const score = Number(type);
    return score > 7
      ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
      : score > 4
      ? "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400"
      : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
  }, []);

  const tableRows = useMemo(() => {
    if (isFetching && isload) {
      return (
        <TableRow className="w-full">
          <TableCell colSpan={12} className="text-center py-6">
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    }

    if (!whatsAppUser?.data?.length) {
      return (
        <TableRow className="w-full">
          <TableCell colSpan={12} className="text-center py-10 text-gray-500">
            No User Found!
          </TableCell>
        </TableRow>
      );
    }

    return whatsAppUser.data.map((user: User) => (
      <TableRow key={user._id}>
        <TableCell colSpan={2} className="px-5 py-2 font-light dark:text-white/90 text-theme-sm text-center">
          {user?.profileName}
        </TableCell>
        <TableCell colSpan={2} className="px-5 py-2 font-light dark:text-white/90 text-theme-sm text-center">
          <span className={`text-xxxs px-2 py-1 rounded-full font-medium text-center ${sentimentScoreClass(user?.avgSentimentScores?.speedScore)}`}>
            {user?.avgSentimentScores?.speedScore}
          </span>
        </TableCell>
        <TableCell colSpan={2} className="px-5 py-2 text-center font-light dark:text-white/90 text-theme-sm">
          <span className={`text-xxxs px-2 py-1 rounded-full font-medium text-center ${sentimentScoreClass(user?.avgSentimentScores?.sentimentScore)}`}>
            {user?.avgSentimentScores?.sentimentScore}
          </span>
        </TableCell>
        <TableCell colSpan={2} className="px-5 py-2 text-center text-gray-500 text-theme-sm">
          <span className="text-xxxs px-2 py-1 rounded-full font-medium text-center bg-[#f2f4f75c] text-white">
            {user?.totalAppointments}
          </span>
        </TableCell>
        <TableCell colSpan={2} className="px-5 py-2 text-center text-gray-500 text-theme-sm dark:text-gray-400">
          {formatUpdatedDate(user?.createdAt)}
        </TableCell>
        <TableCell colSpan={2} className="px-3 py-2 text-gray-500 text-theme-sm dark:text-gray-400">
          <div className="flex justify-center items-center">
            <span className={`text-xxxs px-1 py-0 rounded-full font-medium block w-[50px] text-center ${userTypeClass(user?.userType)}`}>
              {user?.userType}
            </span>
          </div>
        </TableCell>
        <TableCell colSpan={2} className="px-3 py-2 text-gray-500 text-theme-sm text-center">
          <div className="flex justify-center items-center">
            <IconButton className="w-[35px]">
              <Link href={`/user-details?userId=${user._id}`}>
                <View className="!text-gray-500 hover:!text-gray-600 dark:hover:!text-gray-400 text-xxs" />
              </Link>
            </IconButton>
          </div>
        </TableCell>
      </TableRow>
    ));
  }, [isFetching, whatsAppUser, sentimentScoreClass, userTypeClass]);

  return (
    <div>
      <PageBreadcrumb pagePath="Users" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Users</h3>
            <div className="relative">
              <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                <SearchIcon className="!text-gray-500 dark:!text-amber-50" />
              </span>
              <Input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by user/number..."
                className="py-2.5 pl-12 pr-14 text-sm dark:bg-dark-900 bg-transparent dark:bg-white/[0.02]"
              />
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      {tableHeadings.map((head, i) => (
                        <TableCell
                          key={i}
                          colSpan={2}
                          isHeader
                          className="px-5 py-3 text-theme-xs text-gray-500 dark:text-gray-400 font-medium text-center"
                        >
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] w-full">
                    {tableRows}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
        {whatsAppUser?.total > 5 && (
          <TablePagination
            component="div"
            className="text-amber-50"
            rowsPerPageOptions={[5, 10, 25]}
            count={whatsAppUser?.total || 0}
            page={page - 1}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </div>
    </div>
  );
};

export default WhatsappUser;
