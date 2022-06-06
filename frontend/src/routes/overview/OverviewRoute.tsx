import {NuzlockeRun} from "../../api/runs/runsTypes";
import Overview from "./Overview";

export interface OverviewRouteProps {
    run: NuzlockeRun | null
}

export default function OverviewRoute(props: OverviewRouteProps) {
    if (props.run === null) {
        return <h1>No Run Selected</h1>
    } else {
        return <Overview run={props.run!!}/>
    }
}