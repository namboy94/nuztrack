import React from 'react';
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import {appStyle} from "./style/appStyle";
import {QueryClient, QueryClientProvider} from "react-query";
import Dashboard from "./Dashboard";

export default function App() {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider theme={appStyle}>
                    <Dashboard/>
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
