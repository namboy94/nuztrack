import {RunRouteProps} from "../common/RouteProps";
import * as React from "react";
import {EventLog} from "./components/EventLog";
import {useEventLogDataLoader} from "./hooks/EventLog.data.hook";
import {useEventLogViewModel} from "./hooks/vm/EventLog.vm";
import {LoadingIndicator} from "../common/components/LoadingIndicator";

export function EventLogRoute(props: RunRouteProps) {

    const loading = useEventLogDataLoader(props.run)
    const eventLogViewModel = useEventLogViewModel(props.run)

    if (loading) {
        return <LoadingIndicator/>
    }

    return (
        <>
            <EventLog {...eventLogViewModel}/>
        </>
    )
}