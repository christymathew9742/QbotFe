"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Switch from "@/components/form/switch/Switch";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField"
import TablePagination from '@mui/material/TablePagination';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { 
  getBotSelector, 
  getAllPending, 
} from "@/redux/reducers/chatBot/selectors";
import { 
  deleteBotRequest, 
  fetchBotRequest, 
  updateBotRequest 
} from "@/redux/reducers/chatBot/actions";
import Link from "next/link";
import { toast } from "react-toastify";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { 
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditIcon, DeleteIcon } from "@/icons";

export const metadata: Metadata = {
  title: "List all Qbot",
  description:
    "This is the Qbot listing page",
};

interface Bot {
  _id: number;
  title:string;
  status: boolean;
  updatedAt: string;
  user:string;
}

const ChatBot = () => {
  const dispatch = useDispatch<AppDispatch>();
  const botData = useSelector(getBotSelector);
  const [page, setPage] = useState(1);
  const pendingStatus = useSelector(getAllPending)
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [activeBots, setActiveBots] = useState<Record<string, boolean>>({});
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if(isFetching) {
      setIsFetching(pendingStatus.fetch);
    }
  }, [pendingStatus]);

  useEffect(() => {
    fetchBots();
  }, [page, rowsPerPage, search, status]);

  const fetchBots = () => {
    const queryObject = { 
      search,
      status,
      page,
      limit: rowsPerPage,
    };
    const queryString = new URLSearchParams(queryObject as any).toString();
    dispatch(fetchBotRequest(queryString));
  };

  const handleDelete = useCallback(
    async (id: any, title: string) => {
      setIsFetching(false);
      try {
        await dispatch(deleteBotRequest(id));
        if (!pendingStatus?.update) {
          setTimeout(() => {
            fetchBots();
          }, 200);
          toast.success(`${title} deleted successfully`);
        }
      } catch (error) {
        console.log("Error in deleting ChatBot:", error);
        toast.error(`Error in deleting ${title}`);
      }
    },
    [dispatch, fetchBots, pendingStatus?.update]
  );

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFetching(true);
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (value: any) => {
    setIsFetching(true);
    setStatus(value as string | null);
    setPage(1);
  };

  useEffect(() => {
    if (botData?.data?.length) {
      const initialState: Record<string, boolean> = {};
      botData.data.forEach((bot: Bot) => {
        initialState[bot._id] = bot?.status ?? true; 
      });
      setActiveBots(initialState);
    }
  }, [botData]);

  const handleSwitchChange = useCallback(
    async (bot: any, checked: boolean) => {
      setIsFetching(false);
      const updatedBot = {
        ...bot,
        status: checked,
      };
      setActiveBots((prev) => ({
        ...prev,
        [bot._id]: checked,
      }));
  
      try {
        await dispatch(updateBotRequest({ id: bot._id, payload: updatedBot }));
  
        setTimeout(() => {
          if (status !== "") {
            fetchBots();
          }
        }, 250);
      } catch (error) {
        console.error("Update failed:", error);
      }
    },
    [dispatch, fetchBots, status, pendingStatus]
  );
  
  const options = [
    { value: "", label: "All" },
    { value: "true", label: "Enabled" },
    { value: "false", label: "Disabled" },
  ];

  return (
    <div>
      <PageBreadcrumb pagePath="Chatbot"/>
      <div className="space-y-6">
          <div
            className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center px-6 py-5">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                Manage Bot
              </h3>
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <SearchIcon className="!text-gray-500 dark:!text-amber-50"/>
                </span>
                <Input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search bot..."
                  className="py-2.5 pl-12 pr-14 text-sm dark:bg-dark-900 bg-transparent dark:bg-white/[0.02]"
                />
              </div>
              <Select
                options={options}
                defaultValue={status || ""} 
                onChange={handleStatusChange}
                className="dark:bg-white/[0.02] text-gray-800 dark:!text-gray-100"
              />
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell colSpan={2} isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                        Bot Name
                      </TableCell>
                      <TableCell colSpan={2} isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                        Updated Date
                      </TableCell>
                      <TableCell colSpan={2} isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                        Active
                      </TableCell>
                      <TableCell colSpan={2} isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] w-full">
                    {isFetching ? (
                      <TableRow className="w-full">
                        <TableCell colSpan={12} className="text-center py-6">
                          <CircularProgress/>
                        </TableCell>
                      </TableRow>
                    ) : botData?.data?.length ? (
                      botData.data.map((bot: Bot) => (
                        <TableRow key={bot._id}>
                          <TableCell colSpan={2} className="px-5 py-2 text-start font-light divide-gray-100 dark:text-white/90 text-theme-sm">
                            {bot.title}
                          </TableCell>
                          <TableCell colSpan={2} className="px-5 py-2 text-gray-500 text-start text-theme-sm">
                            {new Date(bot.updatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </TableCell>
                          <TableCell colSpan={2} className="px-5 py-2 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Switch
                            label=""
                            color="blue"
                            checked={activeBots[bot._id]}
                            onChange={(checked: boolean) => handleSwitchChange(bot, checked)}
                          />
                          </TableCell>
                          <TableCell colSpan={2} className="flex px-3 py-2 text-gray-500 text-theme-sm">
                            <IconButton 
                              disabled={!activeBots[bot._id]}
                              className="w-[35px]"
                            >
                              <Link
                                href={`/chatbot-details?botId=${bot._id}`}
                                className="-mr-2"
                              >
                                <EditIcon
                                  className={`text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 text-xxs ${
                                    !activeBots[bot._id] && "!text-gray-400 dark:!text-disable-dark"
                                  }`}
                                />
                              </Link>
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(bot._id, bot.title)}
                              className="w-[35px]"
                            >
                              <DeleteIcon className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 text-xxs" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="w-full">
                        <TableCell colSpan={12} className="text-center py-10 text-gray-500">
                          No Bots Found!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
        <TablePagination
          component="div"
          className="text-amber-50"
          rowsPerPageOptions={[5, 10, 25]}
          count={botData?.total || 0}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default ChatBot;










