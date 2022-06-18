import {RunRouteProps} from "../common/RouteProps";
import {useEventAdderDataLoader} from "./hooks/EventAdder.data.hook";
import {useEncounterEventDialogProps} from "./hooks/EncounterEventDialog.hooks";
import {EncounterEventDialog} from "./components/EncounterEventDialog";
import AddIcon from "@mui/icons-material/Add";
import {Button} from "@mui/material";
import * as React from "react";

export function EventAdderRoute(props: RunRouteProps) {

    const loading = useEventAdderDataLoader(props.run)
    const [openEncounterEventDialog, encounterEventDialogProps] = useEncounterEventDialogProps(props.run, props.notify)

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <>
            <Button data-testid="open-encounter-dialog-button"
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openEncounterEventDialog}>
                Encounter
            </Button>
            <EncounterEventDialog {...encounterEventDialogProps}/>
        </>
    )
}