"use client";

import React, { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

interface SaveLoaderProps {
    pending: boolean;
    color?: string | any;
    height?: number;
}

const SaveLoader: React.FC<SaveLoaderProps> = ({
    pending,
    color,
    height = 2,
}) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (pending) {
            setProgress(30);
            timer = setInterval(() => {
                setProgress((prev) => (prev < 95 ? prev + 5 : prev));
            }, 1000);
        } else {
            timer = setTimeout(() => setProgress(100), 500);
        }

        return () => clearInterval(timer);
    }, [pending]);

  return <LoadingBar color={color} height={height} progress={progress} />;
};

export default SaveLoader;
