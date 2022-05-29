import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import * as React from "react";

export default function Footer() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://gitlab.namibsun.net/namibsun/python/nuztrack">
                Nuztrack
            </Link>{' '}
            {new Date().getFullYear()}.
        </Typography>
    );
}
