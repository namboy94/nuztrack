import {Route, Routes} from "react-router-dom";
import React from "react";
import {NuzlockeRun} from "../api/runs/runsTypes";
import {RunSelectorRoute} from "../routes/select_run/RunSelectorRoute";
import {Severity} from "./Snackbar";
import Overview from "../routes/overview/Overview";
import Map from "../routes/map/Map";
import Settings from "../routes/settings/Settings";
import {Close} from "../routes/close/Close";
import Export from "../routes/export/Export";
import Status from "../routes/status/Status";
import AddEventRoute from "../routes/add_event/AddEventRoute";
import LogRoute from "../routes/log/LogRoute";
import TeamRoute from "../routes/team/TeamRoute";

export interface RouterProps {
    setRunId: (id: number) => void
    run: NuzlockeRun | null
    displaySnack: (message: string, severity: Severity) => void
}

export default function Router(props: RouterProps) {
    const {setRunId, run, displaySnack} = props
    const runSelector = <RunSelectorRoute run={run} setRunId={setRunId} displaySnack={displaySnack}/>
    return (
        <Routes>
            <Route path="/" element={runSelector}/>
            <Route path="/select_run" element={runSelector}/>
            <Route path="/add_event" element={<AddEventRoute run={run} displaySnack={displaySnack}/>}/>
            <Route path="/overview" element={<Overview run={run}/>}/>
            <Route path="/team" element={<TeamRoute run={props.run}/>}/>
            <Route path="/map" element={<Map/>}/>
            <Route path="/log" element={<LogRoute run={props.run}/>}/>
            <Route path="/status" element={<Status/>}/>
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/export" element={<Export/>}/>
            <Route path="/close" element={<Close setRunId={setRunId}/>}/>
        </Routes>
    )
}