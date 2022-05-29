import * as React from "react";
import AddEvent from "./AddEvent";
import {NuzlockeRunTO} from "../../api/runs/runsTransfer";

interface AddEventRouteProps {
    run: NuzlockeRunTO | null
}

export default function AddEventRoute(props: AddEventRouteProps) {
    if (props.run === null) {
        return (<></>)
    } else {
        return <AddEvent run={props.run}/>
    }
}
