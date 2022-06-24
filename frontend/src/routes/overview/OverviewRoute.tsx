import {RunRouteProps} from "../common/RouteProps";
import {useOverviewDataLoader} from "./hooks/Overview.data";

export function OverviewRoute(props: RunRouteProps) {
    const {run, notify} = props

    const loading = useOverviewDataLoader(run)

    return (
        <h1>{run.name}</h1>
    )
}