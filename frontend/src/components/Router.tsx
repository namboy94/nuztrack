import {Route, Routes} from "react-router-dom";
import React from "react";
import {Severity} from "./Snackbar";
import {RunSelectorRoute} from "../routes/runSelector/runSelector.route";

export interface RouterProps {
    displaySnack: (message: string, severity: Severity) => void
}

export default function Router(props: RouterProps) {
    const {displaySnack} = props
    //const runSelector = <RunSelectorRoute run={run} setRunId={setRunId} displaySnack={displaySnack}/>
    return (
        <Routes>
            <Route path="/" element={<RunSelectorRoute/>}/>
            {/*<Route path="/" element={runSelector}/>*/}
            {/*<Route path="/select_run" element={runSelector}/>*/}
            {/*<Route path="/add_event" element={<AddEventRoute run={run} displaySnack={displaySnack}/>}/>*/}
            {/*<Route path="/overview" element={<OverviewRoute run={run}/>}/>*/}
            {/*<Route path="/team" element={<TeamRoute run={props.run}/>}/>*/}
            {/*<Route path="/map" element={<Map/>}/>*/}
            {/*<Route path="/log" element={<LogRoute run={props.run}/>}/>*/}
            {/*<Route path="/status" element={<Status/>}/>*/}
            {/*<Route path="/settings" element={<Settings/>}/>*/}
            {/*<Route path="/export" element={<Export/>}/>*/}
            {/*<Route path="/close" element={<Close setRunId={setRunId}/>}/>*/}
        </Routes>
    )
}