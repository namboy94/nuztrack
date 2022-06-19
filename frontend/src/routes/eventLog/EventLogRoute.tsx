import {RunRouteProps} from "../common/RouteProps";
import * as React from "react";
import {useEventLogDataLoader} from "./hooks/EventLog.hooks";
import {useEventLogProps} from "./hooks/EventLog.data.hook";
import {EventLog} from "./components/EventLog";

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