import {RunRouteProps} from "../common/RouteProps";
import * as React from "react";
import {EventLog} from "./components/EventLog";
import {useEventLogDataLoader} from "./hooks/EventLog.data.hook";
import {useEventLogProps} from "./hooks/EventLog.hooks";

export function EventLogRoute(props: RunRouteProps) {

    const loading = useEventLogDataLoader(props.run)
    const eventLogProps = useEventLogProps(props.run)

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <>
            <EventLog {...eventLogProps}/>
        </>
    )
}