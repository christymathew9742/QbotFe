"use client";

import React, { useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";

interface Props {
    children: React.ReactNode;
    theme?: "light" | "dark";
}

const MuiThemeProviderWrapper: React.FC<Props> = ({ children, theme = "light" }) => {
    const muiTheme = useMemo(
        () =>
        createTheme({
            palette: {
                mode: theme,
                primary: { main: "#1976d2" },
                secondary: { main: "#9c27b0" },
                text: {
                    primary: theme === "dark" ? "#fff" : "#000",
                    secondary: theme === "dark" ? "#ccc" : "#555",
                },
            },
            components: {
                ...(theme === "dark"
                ? {
                    MuiDateCalendar: {
                        styleOverrides: {
                            root: { backgroundColor: "#1d2939" },
                        },
                    },
                    MuiPickersLayout: {
                        styleOverrides: {
                            root: { backgroundColor: "#1d2939" },
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                "&[data-mui-popper-placement]": {
                                    backgroundColor: "#1d2939",
                                },
                            },
                        },
                    },
                }
                : {}),
            },
        }),
        [theme]
    );

    return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
};

export default MuiThemeProviderWrapper;


