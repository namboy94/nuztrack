import * as React from "react";
import AddEvent from "./AddEvent";
import {NuzlockeRun} from "../../api/runs/runsTypes";

interface AddEventRouteProps {
    run: NuzlockeRun | null
}

export default function AddEventRoute(props: AddEventRouteProps) {
    if (props.run === null) {
        return (<></>)
    } else {
        return <AddEvent run={props.run}/>
    }
}
