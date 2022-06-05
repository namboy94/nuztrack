import {NuzlockeRun} from "../../api/runs/runsTypes";
import Team from "./Team";

export interface TeamRouteProps {
    run: NuzlockeRun | null
}

export default function TeamRoute(props: TeamRouteProps) {
    if (props.run === null) {
        return <h1>Run not loaded</h1>
    } else {
        return <Team run={props.run!!}/>
    }
}