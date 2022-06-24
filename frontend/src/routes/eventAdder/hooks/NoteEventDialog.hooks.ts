import {NuzlockeRun} from "../../../data/runs/runs.model";
import {NotificationFN} from "../../../global/Snackbar";
import {useQuery, useSubmitter} from "../../../util/observable.hooks";
import {gamesService} from "../../../data/games/games.service";
import {useState} from "react";
import {NoteEventDialogProps, NoteEventDialogState} from "../components/NoteEventDialog";
import {useResetState} from "../../../util/state.hook";
import {CreateNoteEvent} from "../../../data/events/events.model";
import {eventsService} from "../../../data/events/events.service";

export function useNoteEventDialogProps(run: NuzlockeRun, notify: NotificationFN): [() => void, NoteEventDialogProps] {
    const locationRegistry = useQuery(() => gamesService.getGameLocationRegistry$(run.game), undefined, [])
    const locations = locationRegistry?.getLocationNames() ?? []
    const state = useNoteEventDialogState()

    const [open, setOpen] = useState(false)
    const onClose = () => {
        setOpen(false)
        state.reset()
    }
    const submit = useNoteEventSubmit(run, notify, onClose, state)

    const props: NoteEventDialogProps = {
        locations: locations,
        onClose: onClose,
        open: open,
        state: state,
        submit: submit
    }

    return [() => setOpen(true), props]

}

export function useNoteEventDialogState(): NoteEventDialogState {
    const [text, setText, resetText] = useResetState("")
    const [location, setLocation, resetLocation] = useResetState("")

    const reset = () => {
        resetText()
        resetLocation()
    }

    return {
        text: text,
        setText: setText,
        location: location,
        setLocation: setLocation,
        reset: reset
    }
}

export function useNoteEventSubmit(
    run: NuzlockeRun,
    notify: NotificationFN,
    onClose: () => void,
    state: NoteEventDialogState
) {
    const creator: CreateNoteEvent = {
        location: state.location,
        text: state.text
    }

    const onSuccess = () => {
        notify("Note created successfully", "success")
        onClose()
    }

    const onError = (e: any) => notify(`Failed to create note: '${e.response.data.reason}'`, "error")

    return useSubmitter(() => eventsService.createNoteEvent$(run.id, creator), onSuccess, onError)
}