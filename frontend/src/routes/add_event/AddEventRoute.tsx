import * as React from "react";
import AddEvent from "./AddEvent";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import {Severity} from "../../components/Snackbar";

interface AddEventRouteProps {
    run: NuzlockeRun | null,
    displaySnack: (message: string, severity: Severity) => void
}

export default function AddEventRoute(props: AddEventRouteProps) {
    if (props.run === null) {
        return (<></>)
    } else {
        return <AddEvent run={props.run} displaySnack={props.displaySnack}/>
    }
}
