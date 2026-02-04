"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
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
import { getBotSelector, getAllPending } from "@/redux/reducers/chatBot/selectors";
import { deleteBotRequest, fetchBotRequest, updateBotRequest } from "@/redux/reducers/chatBot/actions";
import Link from "next/link";
import { toast } from "react-toastify";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { EditIcon, DeleteIcon, Robot } from "@/icons";
import { extractFileKeys, formatUpdatedDate } from "@/utils/utils";
import api from "@/utils/axios";
import ConfirmModal from "@/components/ConfirmModal";

export const metadata: Metadata = {
  title: "bot List | NimbleMeet AI WhatsApp Chatbot",
  description:
    "View and manage all your Qbots in NimbleMeet. Monitor AI-powered WhatsApp chatbots, automate conversations, and control customer engagement from a single dashboard.",
};

interface Bot {
  _id: number;
  title: string;
  status: boolean;
  updatedAt: string;
  user: string;
  nodes: any[];
}

const ChatBot = () => {
  const dispatch = useDispatch<AppDispatch>();
  const botData = useSelector(getBotSelector);
  const pendingStatus = useSelector(getAllPending);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>("");
  const [activeBots, setActiveBots] = useState<Record<string, boolean>>({});
  const [isFetching, setIsFetching] = useState(true);
  const [isload, setIsLoad] = useState(true);
  const toggleLock = useRef<Record<string, boolean>>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [botToDelete, setBotToDelete] = useState<Bot | null>(null);

  useEffect(() => {
    setIsFetching(pendingStatus.fetch);
  }, [pendingStatus.fetch]);

  const fetchBots = useCallback(() => {
    const query = {
      search,
      status: status || "",
      page,
      limit: rowsPerPage,
    };
    const queryString = new URLSearchParams(query as any).toString();
    dispatch(fetchBotRequest(queryString));
  }, [dispatch, search, status, page, rowsPerPage]);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  useEffect(() => {
    if (botData?.data?.length) {
      const initialState: Record<string, boolean> = {};
      botData.data.forEach((bot: Bot) => {
        initialState[bot._id] = bot?.status ?? true;
      });
      setActiveBots(initialState);
    }
  }, [botData]);

  const handleInitiateDelete = (bot: Bot) => {
    setBotToDelete(bot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setIsModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!botToDelete) return;

    setIsLoading(true);
    const { _id: id, title, nodes } = botToDelete;
    const inputs = nodes.flatMap((node) => node.data.inputs || []);

    try {
      let fileKey: any = extractFileKeys(inputs);
      if (Array.isArray(fileKey) && fileKey.length > 0) {
        await api.delete(`/createbots/${id}/files`, {
          data: { fileKey, chatbotId: id },
        });
      }

      await dispatch(deleteBotRequest(id));
      toast.success(`${title} deleted successfully`);
      setIsModalOpen(false);

    } catch (error) {
      console.error("Error in deleting ChatBot:", error);
      toast.error(`Error in deleting ${title}`);
    } finally {
      setIsLoading(false);
      setIsLoad(false);
      setTimeout(() => {
        fetchBots();
      }, 500);
    }
  };

  const handleChangePage = (_: any, newPage: number) => setPage(newPage + 1);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoad(false);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (value: any) => {
    setStatus(value as string | null);
    setPage(1);
  };

  const handleSwitchChange = useCallback(
    async (bot: Bot, checked: boolean) => {
      if (toggleLock.current[bot._id]) return;
      toggleLock.current[bot._id] = true;

      setActiveBots((prev) => ({ ...prev, [bot._id]: checked }));
      try {
        await dispatch(updateBotRequest({ id: bot._id, payload: { ...bot, status: checked } }));
      } catch (error) {
        console.error("Update failed:", error);
      } finally {
        toggleLock.current[bot._id] = false;
        setIsLoad(false);
        if (status !== "") {
          setTimeout(() => {
            fetchBots();
          }, 500);
        }
      }
    },
    [dispatch, fetchBots, pendingStatus.fetch, pendingStatus.update, status]
  );

  const options = [
    { value: "", label: "All" },
    { value: "enabled", label: "Enabled" },
    { value: "disabled", label: "Disabled" },
  ];

  return (
    <div>
      <PageBreadcrumb  pagePath="Chatbot"/>
      <div className="space-y-6">
        <div className="rounded-md p-1 bg-white dark:border-color-primary dark:bg-white/[0.03] shadow-xl backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center px-6 py-5 mb-1">
            <h3 className="text-base font-medium text-color-primary dark:text-white/90">Manage Bot</h3>
            <div className="relative">
              <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                <SearchIcon className="!text-color-primary-light dark:!text-amber-50 rounded-md!" />
              </span>
              <Input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search bot..."
                className="py-2.5 pl-12 pr-14 text-sm dark:bg-dark-900 bg-transparent dark:bg-white/[0.02] rounded-md!"
              />
            </div>
            <Select
              options={options}
              defaultValue={status || ""}
              onChange={handleStatusChange}
              className="dark:bg-white/[0.02] dark:!text-gray-100 rounded-md!"
            />
          </div>
          <div className="border-t border-gray-300 dark:border-color-primary pt-4">
            <div className="mx-auto overflow-hidden bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell colSpan={2} isHeader className="px-5 py-3 text-start text-theme-xs text-color-primary-light dark:text-gray-400">Bot Name</TableCell>
                      <TableCell colSpan={2} isHeader className="px-5 py-3 text-start text-theme-xs text-color-primary-light dark:text-gray-400">Updated Date</TableCell>
                      <TableCell colSpan={2} isHeader className="px-5 py-3 text-start text-theme-xs text-color-primary-light dark:text-gray-400">Active</TableCell>
                      <TableCell colSpan={2} isHeader className="px-5 py-3 text-start text-theme-xs text-color-primary-light dark:text-gray-400">Action</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200 dark:divide-white/[0.05] w-full">
                    {isFetching && isload ? (
                      <TableRow className="w-full">
                        <TableCell colSpan={12} className="text-center py-6">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : botData?.data?.length ? (
                      botData?.data?.map((bot: Bot) => (
                        <TableRow key={bot._id}>
                          <TableCell
                            colSpan={2}
                            className="px-5 py-2 text-start font-light divide-gray-100 text-theme-sm dark:text-white/90 text-color-primary"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 group-hover:bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-lg">
                                <Robot className="text-color-primary!" />
                              </div>
                              <span>{bot.title}</span>
                            </div>
                          </TableCell>
                          <TableCell colSpan={2} className="px-5 py-2 text-start font-light divide-gray-100 text-theme-sm dark:text-white/90 text-color-primary">
                            {formatUpdatedDate(bot?.updatedAt)}
                          </TableCell>
                          <TableCell colSpan={2} className="px-5 py-2 text-start font-light divide-gray-100 dark:text-white/90 text-color-primary-light">
                            <Switch
                              label=""
                              color="theme"
                              checked={activeBots[bot._id]}
                              onChange={(checked: boolean) => handleSwitchChange(bot, checked)}
                            />
                          </TableCell>
                          <TableCell colSpan={2} className="flex px-3 py-2 text-color-primary-light text-color-primary-light">
                            <IconButton
                              disabled={!activeBots[bot._id]}
                              className="w-[35px]"
                            >
                              <Link
                                href={`/chatbot-details?botId=${bot._id}`}
                                className="mr-0"
                              >
                                <EditIcon
                                  className={`text-color-primary-light hover:text-gray-600 dark:hover:text-color-primary-light text-xxs ${
                                    !activeBots[bot._id] && "!text-gray-300 dark:!text-disable-dark"
                                  }`}
                                />
                              </Link>
                            </IconButton>
                            <IconButton
                              onClick={() => handleInitiateDelete(bot)}
                              className="w-[35px]"
                            >
                              <DeleteIcon className="text-color-primary-light hover:text-red-600 dark:hover:text-red-400 text-xxs transition-colors" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="w-full">
                        <TableCell colSpan={12} className="text-center py-10 text-color-primary-light">
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
        {botData?.total > 5 && (
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25]}
            count={botData?.total || 0}
            page={page - 1}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
        
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          title="Delete Chatbot"
          message={`Are you sure you want to delete "${botToDelete?.title || 'this chatbot'}"? This action cannot be undone.`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          isLoading={isLoading}
          type="danger" 
        />
      </div>
    </div>
  );
};

export default ChatBot;











