import {Route, Routes} from "react-router-dom";
import React from "react";
import {NotificationFN} from "./Snackbar";
import {RunSelectorRoute} from "../routes/runSelector/RunSelector.route";
import {useQuery} from "../util/observable.hooks";
import {runsService} from "../data/runs/runs.service";
import {EventAdderRoute} from "../routes/eventAdder/EventAdder.route";
import {EventLogRoute} from "../routes/eventLog/EventLogRoute";
import {OverviewRoute} from "../routes/overview/OverviewRoute";
import {TeamRoute} from "../routes/team/TeamRoute";
import {RouteProps, RunRouteProps} from "../routes/common/RouteProps";

export interface RouterProps {
    notify: NotificationFN
}

export default function Router(props: RouterProps) {
    const {notify} = props
    const run = useQuery(() => runsService.getActiveRun$(), undefined, [])

    const routeProps: RouteProps = {notify: notify}

    if (run === undefined) {
        return <Routes>
            <Route path="/" element={<RunSelectorRoute {...routeProps}/>}/>
        </Routes>
    } else {
        const runRouteProps: RunRouteProps = {run: run, notify: notify}
        return (
            <Routes>
                <Route path="/" element={<RunSelectorRoute {...routeProps}/>}/>
                <Route path="/add_event" element={<EventAdderRoute {...runRouteProps}/>}/>
                <Route path="/log" element={<EventLogRoute {...runRouteProps}/>}/>
                <Route path="/overview" element={<OverviewRoute {...runRouteProps}/>}/>
                <Route path="/team" element={<TeamRoute {...runRouteProps}/>}/>
            </Routes>
        )
    }
}