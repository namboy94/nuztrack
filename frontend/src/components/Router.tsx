import {Route, Routes} from "react-router-dom";
import React from "react";
import {NotificationFN} from "./Snackbar";
import {RunSelectorRoute} from "../routes/runSelector/RunSelector.route";
import {useQuery} from "../util/observable.hooks";
import {runsService} from "../data/runs/runs.service";
import {EventAdderRoute} from "../routes/eventAdder/EventAdder.route";
import {EventLogRoute} from "../routes/eventLog/EventLogRoute";

export interface RouterProps {
    notify: NotificationFN
}

export default function Router(props: RouterProps) {
    const {notify} = props
    const run = useQuery(() => runsService.getActiveRun$(), undefined, [])

    if (run === undefined) {
        return <Routes>
            <Route path="/" element={<RunSelectorRoute notify={notify}/>}/>
        </Routes>
    } else {
        return (
            <Routes>
                <Route path="/" element={<RunSelectorRoute notify={notify}/>}/>
                <Route path="/add_event" element={<EventAdderRoute run={run} notify={notify}/>}/>
                <Route path="/log" element={<EventLogRoute run={run} notify={notify}/>}/>
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
}