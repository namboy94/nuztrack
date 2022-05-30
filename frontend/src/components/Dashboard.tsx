import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Paper from "@mui/material/Paper";
import Router from "./Router";
import Footer from "./Footer";
import React, {useState} from "react";
import {useRunQuery} from "../api/runs/runsQuery";
import {getSelectedRunId} from "../util/runId";
import {performLoadingCheck} from "../util/loading";
import Snackbar, {Severity} from "./Snackbar";

export default function Dashboard() {

    const [mobileOpen, setMobileOpen] = useState(false)
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [snackBarMessage, setSnackBarMessage] = useState("")
    const [snackBarSeverity, setSnackBarSeverity] = useState<Severity>("info")

    const [runId, setRunId] = useState(getSelectedRunId())
    const runQuery = useRunQuery(runId)

    const loadingCheck = performLoadingCheck([runQuery])
    if (loadingCheck !== null) {
        return loadingCheck
    }
    const run = runQuery.data ? runQuery.data : null

    const displaySnack = (message: string, severity: Severity) => {
        setSnackBarOpen(true)
        setSnackBarMessage(message)
        setSnackBarSeverity(severity)
    }

    return (
        <Box sx={{display: 'flex', minHeight: '100vh'}}>
            <CssBaseline/>
            <Box component="nav" sx={{width: {sm: 256}, flexShrink: {sm: 0}}}>
                <Sidebar run={run}/>
            </Box>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <Header onDrawerToggle={() => setMobileOpen(!mobileOpen)}/>
                <Box component="main" sx={{flex: 1, py: 6, px: 4, bgcolor: '#eaeff1'}}>
                    <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden'}}>
                        <Router setRunId={setRunId} run={run} displaySnack={displaySnack}/>
                    </Paper>
                </Box>
                <Box component="footer" sx={{p: 2, bgcolor: '#eaeff1'}}>
                    <Footer/>
                </Box>
            </Box>
            <Snackbar
                open={snackBarOpen}
                setOpen={setSnackBarOpen}
                message={snackBarMessage}
                severity={snackBarSeverity}
            />
        </Box>
    )
}