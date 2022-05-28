import React, {useState} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import {theme} from "../style/Theme";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import {RunSelector} from "../routes/select_run/RunSelector";
import {Close} from "../routes/Close";
import Paper from "@mui/material/Paper";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";
import AddEvent from "../routes/AddEvent";
import Overview from "../routes/Overview";
import Team from "../routes/Team";
import Log from "../routes/Log";
import Map from "../routes/Map";
import Status from "../routes/Status";
import Export from "../routes/Export";
import Settings from "../routes/Settings";
import {QueryClient, QueryClientProvider} from "react-query";
import {getSelectedRunId} from "../util/runId";

export default function App() {

    const queryClient = new QueryClient()

    const [mobileOpen, setMobileOpen] = useState(false)
    const [runId, setRunId] = useState(getSelectedRunId())

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    };

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>

                <ThemeProvider theme={theme}>
                    <Box sx={{display: 'flex', minHeight: '100vh'}}>
                        <CssBaseline/>
                        <Box component="nav" sx={{width: {sm: 256}, flexShrink: {sm: 0}}}>
                            <Sidebar
                                PaperProps={{style: {width: 256}}}
                                sx={{display: {sm: 'block', xs: 'none'}}}
                                runid={runId}
                            />
                        </Box>
                        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                            <Header onDrawerToggle={handleDrawerToggle}/>
                            <Box component="main" sx={{flex: 1, py: 6, px: 4, bgcolor: '#eaeff1'}}>
                                <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden'}}>
                                    <Routes>
                                        <Route path="/" element={<RunSelector setRunId={setRunId}/>}/>
                                        <Route path="/add_event" element={<AddEvent/>}/>
                                        <Route path="/overview" element={<Overview runId={runId}/>}/>
                                        <Route path="/team" element={<Team/>}/>
                                        <Route path="/map" element={<Map/>}/>
                                        <Route path="/log" element={<Log/>}/>
                                        <Route path="/status" element={<Status/>}/>
                                        <Route path="/settings" element={<Settings/>}/>
                                        <Route path="/export" element={<Export/>}/>
                                        <Route path="/close" element={<Close setRunId={setRunId}/>}/>
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
        </QueryClientProvider>
    );
}
