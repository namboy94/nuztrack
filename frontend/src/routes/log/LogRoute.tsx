import {NuzlockeRun} from "../../api/runs/runsTypes";
import Log from "./Log";

export interface LogRouteProps {
    run: NuzlockeRun | null
}

export default function LogRoute(props: LogRouteProps) {
    if (props.run === null) {
        return <h1>Run not loaded</h1>
    } else {
        return <Log run={props.run!!}/>
    }
}