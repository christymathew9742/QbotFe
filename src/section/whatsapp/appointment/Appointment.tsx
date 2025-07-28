"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { number } from "yup";

export const metadata: Metadata = {
  title: "List all Qbot",
  description: "This is the Qbot listing page",
};

const totalCards = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name:'Christy',
  number: `+123456789${i}`,
  botTitle: `Qbot ${i + 1}`,
  title: `Card ${i + 1}`,
  description: `Description for card ${i + 1}`,
}));

const Appoinment = () => {
  const [visibleCards, setVisibleCards] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom && visibleCards < totalCards.length && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleCards((prev) => prev + 4);
        setIsLoading(false);
      }, 800); // simulate delay
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCards, isLoading]);

  return (
    <div>
      <PageBreadcrumb pagePath="Chatbot" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              All Qbots
            </h3>
          </div>
          <div className="p-4 border-t dark:border-gray-800 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {totalCards.slice(0, visibleCards).map((card) => (
                <div
                  key={card.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg transition-all p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-1 mt-1 mb-4">
                    <div>
                      <h4  className="text-md font-semibold text-gray-800 dark:text-white/90">
                        {card?.name}
                      </h4>
                      <span className="block text-gray-500 text-theme-xs dark:text-white/90">
                        📞 {card?.number}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
            {isLoading && (
              <div className="flex justify-center mt-6">
                <button
                  disabled
                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full shadow-sm animate-pulse"
                >
                  Loading...
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appoinment;
