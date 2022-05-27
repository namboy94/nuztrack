import React, {useState} from 'react';
import 'bulma/css/bulma.min.css';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import {theme} from "../style/Theme";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import {RunSelector} from "../routes/RunSelector";
import {Close} from "../routes/Close";
import Paper from "@mui/material/Paper";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";

export default function App() {
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    };

    return (
        <BrowserRouter>

        <ThemeProvider theme={theme}>
            <Box sx={{display: 'flex', minHeight: '100vh'}}>
                <CssBaseline/>
                <Box component="nav" sx={{width: {sm: 256}, flexShrink: {sm: 0}}}>
                    <Sidebar PaperProps={{style: {width: 256}}} sx={{display: {sm: 'block', xs: 'none'}}}/>
                </Box>
                <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <Header onDrawerToggle={handleDrawerToggle}/>
                    <Box component="main" sx={{flex: 1, py: 6, px: 4, bgcolor: '#eaeff1'}}>
                        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden'}}>
                            <Routes>
                                <Route path="/" element={<RunSelector/>}/>
                                <Route path="/test" element={<h1>A</h1>}/>
                                <Route path="/test/x" element={<h1>B</h1>}/>
                                <Route path="/close" element={<Close/>}/>
                            </Routes>
                        </Paper>
                    </Box>
                    <Box component="footer" sx={{p: 2, bgcolor: '#eaeff1'}}>
                        <Footer/>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
        </BrowserRouter>
    );
}
