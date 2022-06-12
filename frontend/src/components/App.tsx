import React from 'react';
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import {appStyle} from "./style/appStyle";
import Dashboard from "./Dashboard";

export default function App() {
    return (
        <BrowserRouter>
            <ThemeProvider theme={appStyle}>
                <Dashboard/>
            </ThemeProvider>
        </BrowserRouter>
    );
}
