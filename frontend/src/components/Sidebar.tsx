import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer, {DrawerProps} from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import {Link, useLocation} from "react-router-dom";
import PetsIcon from '@mui/icons-material/Pets';
import AddIcon from '@mui/icons-material/Add';
import MapIcon from '@mui/icons-material/Map';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InfoIcon from '@mui/icons-material/Info';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import SettingsIcon from '@mui/icons-material/Settings';
import {useQuery} from "react-query";
import {loadRun} from "../api/runs/runsApi";
import {performLoadingCheck} from "../util/loading";

const categories = [
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

const item = {
    py: '2px',
    px: 3,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover, &:focus': {
        bgcolor: 'rgba(255, 255, 255, 0.08)',
    },
};

const itemCategory = {
    boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
    py: 1.5,
    px: 3,
};

export interface SidebarProps extends DrawerProps {
    runid: number
}

export default function Sidebar(props: SidebarProps) {

    const {...other} = props;
    const location = useLocation();

    let sections = categories;
    const runInfo = useQuery(`runs/${props.runid}`, () => loadRun(props.runid))

    const loadingCheck = performLoadingCheck([runInfo])
    if (loadingCheck !== null) {
        return loadingCheck
    }

    if (runInfo.data === undefined) {
        sections = []
    } else {
        sections[0]["id"] = runInfo.data.name
    }

    return (
        <Drawer variant="permanent" {...other}>
            <List disablePadding>
                <ListItem sx={{...item, ...itemCategory, fontSize: 22, color: '#fff'}}>
                    Nuztrack
                </ListItem>
                <ListItem sx={{...item, ...itemCategory}}>
                    <ListItemIcon>
                        <HomeIcon/>
                    </ListItemIcon>
                    <ListItemText><Link to="/">My Runs</Link></ListItemText>
                </ListItem>
                {sections.map(({id, children}) => (
                    <Box key={id} sx={{bgcolor: '#101F33'}}>
                        <ListItem sx={{py: 2, px: 3}}>
                            <ListItemText sx={{color: '#fff'}}>{id}</ListItemText>
                        </ListItem>
                        {children.map(({id: childId, icon, path}) => (
                            <Link key={childId} to={path}>
                                <ListItem disablePadding>
                                    <ListItemButton selected={path === location.pathname} sx={item}>
                                        <ListItemIcon>{icon}</ListItemIcon>
                                        <ListItemText>{childId}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        ))}
                        <Divider sx={{mt: 2}}/>
                    </Box>
                ))}
            </List>
        </Drawer>
    );
}
