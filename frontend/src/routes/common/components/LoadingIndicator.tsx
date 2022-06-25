import {CircularProgress} from "@mui/material";

export function LoadingIndicator() {
    return <div style={{display: 'flex', justifyContent: 'center'}}>
        <CircularProgress/>
    </div>
}
