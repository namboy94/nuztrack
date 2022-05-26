import * as React from "react";
import {Navigate} from "react-router-dom";


export function Close() {
    localStorage.removeItem("runId")
    return <Navigate to="/"/>
}
