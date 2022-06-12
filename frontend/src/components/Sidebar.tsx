import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import {Link, useLocation} from "react-router-dom";
import {item, itemCategory} from "./style/sidebarStyle"
import {structure} from "./Sidebar.structure";

export default function Sidebar() {

    const location = useLocation();
    let sections = structure;

    sections = []

    return (
        <Drawer variant="permanent"
                PaperProps={{style: {width: 256}}}
                sx={{display: {sm: 'block', xs: 'none'}}}>
            <List disablePadding>
                <ListItem sx={{...item, ...itemCategory, fontSize: 22, color: '#fff'}}>
                    Nuztrack
                </ListItem>
                <ListItem sx={{...item, ...itemCategory}}>
                    <ListItemIcon>
                        <HomeIcon/>
                    </ListItemIcon>
                    <ListItemText><Link style={{textDecoration: 'none', color: "#fff"}} to="/">My
                        Runs</Link></ListItemText>
                </ListItem>
                {sections.map(({id, children}) => (
                    <Box key={id} sx={{bgcolor: '#101F33'}}>
                        <ListItem sx={{py: 2, px: 3}}>
                            <ListItemText sx={{color: '#fff'}}>{id}</ListItemText>
                        </ListItem>
                        {children.map(({id: childId, icon, path}) => (
                            <Link style={{textDecoration: 'none'}} key={childId} to={path}>
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
