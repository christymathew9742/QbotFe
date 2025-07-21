"use client";

import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: "List all Qbot",
  description:
    "This is the Qbot listing page",
};


const Appoinment = () => {
 
  
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

export default Appoinment;
















