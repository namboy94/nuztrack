import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SettingsIcon from "@mui/icons-material/Settings";
import PetsIcon from "@mui/icons-material/Pets";
import * as React from "react";

export const navigatorStructure = [
    {
        id: 'Run Name',
        children: [
            {id: 'Add Event', icon: <AddIcon/>, path: "/add_event"},
            {id: 'Log', icon: <FormatListBulletedIcon/>, path: "/log"},
            {id: 'Overview', icon: <InfoIcon/>, path: "/overview"},
            {id: 'Team', icon: <PetsIcon/>, path: "/team"}
        ],
    },
    {
        id: 'Other',
        children: [
            {id: 'Settings', icon: <SettingsIcon/>, path: "/settings"}
        ],
    },
];
