import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SettingsIcon from "@mui/icons-material/Settings";
import * as React from "react";

export const structure = [
    {
        id: 'Run Name',
        children: [
            {id: 'Add Event', icon: <AddIcon/>, path: "/add_event"},
            {id: 'Log', icon: <FormatListBulletedIcon/>, path: "/log"},
            {id: 'Overview', icon: <InfoIcon/>, path: "/overview"},
            // {id: 'Team', icon: <PetsIcon/>, path: "/team"},
            // {id: 'Map', icon: <MapIcon/>, path: "/map"},
            // {id: 'Status', icon: <CheckIcon/>, path: "/status"},
        ],
    },
    {
        id: 'Other',
        children: [
            {id: 'Settings', icon: <SettingsIcon/>, path: "/settings"},
            // {id: 'Export', icon: <ImportExportIcon/>, path: "/export"},
        ],
    },
];
