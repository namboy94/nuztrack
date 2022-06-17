import {RunRouteProps} from "../common/RouteProps";
import {useEventAdderDataLoader} from "./hooks/EventAdder.data.hook";
import {useEncounterEventDialogProps} from "./hooks/EncounterEventDialog.hooks";

export function EventAdderRoute(props: RunRouteProps) {

    const loading = useEventAdderDataLoader(props.run)
    const [openEncounterEventDialog, encounterEventDialogProps] = useEncounterEventDialogProps(props.run, props.notify)

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <>
        </>
    )
}