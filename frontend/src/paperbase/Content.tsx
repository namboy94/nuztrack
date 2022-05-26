import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import App from "../components/App";
import {RunSelector} from "../pages/RunSelector";
import {Close} from "../pages/Close";

export default function Content() {
    return (
        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden'}}>

                <Routes>
                    <Route path="/" element={<RunSelector/>}/>
                    <Route path="/test" element={<h1>A</h1>}/>
                    <Route path="/test/x" element={<h1>B</h1>}/>
                    <Route path="/close" element={<Close/>}/>
                </Routes>

        </Paper>
    );
}