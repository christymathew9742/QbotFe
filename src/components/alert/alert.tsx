// hooks/useAlert.tsx
import React from "react";

type AlertType = "error" | "info" | "success" | "warning";

interface AlertOptions {
    type?: AlertType;
    message: string;
    title?: string;
}

export const useAlert = () => {
    const renderAlert = ({ type = "info", message, title }: AlertOptions) => {
        const colors: Record<AlertType, string> = {
            error: "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400",
            info: "text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400",
            success: "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400",
            warning: "text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400",
        };

        return (
            <div
                className={`flex items-center p-4 mb-4 text-sm rounded-lg ${colors[type]}`}
                role="alert"
            >
                <svg
                    className="shrink-0 inline w-4 h-4 me-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">{title || type}</span>
                <div>
                    {title && <span className="font-medium">{title} </span>}
                    {message}
                </div>
            </div>
        );
    };

    return { renderAlert };
};
