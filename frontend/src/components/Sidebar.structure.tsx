import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import PetsIcon from "@mui/icons-material/Pets";
import MapIcon from "@mui/icons-material/Map";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CheckIcon from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ClearIcon from "@mui/icons-material/Clear";
import * as React from "react";

export const structure = [
    {
        id: 'Run Name',
        children: [
            {id: 'Add Event', icon: <AddIcon/>, path: "/add_event"},
            {id: 'Overview', icon: <InfoIcon/>, path: "/overview"},
            {id: 'Team', icon: <PetsIcon/>, path: "/team"},
            {id: 'Map', icon: <MapIcon/>, path: "/map"},
            {id: 'Log', icon: <FormatListBulletedIcon/>, path: "/log"},
            {id: 'Status', icon: <CheckIcon/>, path: "/status"},
        ],
    },
    {
        id: 'Other',
        children: [
            {id: 'Settings', icon: <SettingsIcon/>, path: "/settings"},
            {id: 'Export', icon: <ImportExportIcon/>, path: "/export"},
            {id: 'Close', icon: <ClearIcon/>, path: "/close"}
        ],
    },
];
