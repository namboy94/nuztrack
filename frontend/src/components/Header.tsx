import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import {keycloak} from "../util/keycloak";

interface HeaderProps {
    onDrawerToggle: () => void;
}

export default function Header(props: HeaderProps) {

    return (
        <React.Fragment>
            <AppBar color="primary" position="sticky" elevation={0}>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center">
                        <Grid sx={{display: {sm: 'none', xs: 'block'}}} item>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={props.onDrawerToggle}
                                edge="start"
                            >
                                <MenuIcon/>
                            </IconButton>
                        </Grid>
                        <Grid item xs/>
                        <Grid item>
                            <IconButton color="inherit" sx={{p: 0.5}} onClick={() => keycloak.logout()}>
                                <Avatar alt="User Avatar"/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}