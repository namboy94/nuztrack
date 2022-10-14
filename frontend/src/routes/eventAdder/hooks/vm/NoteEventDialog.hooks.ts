import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {NotificationFN} from "../../../../global/Snackbar";
import {useQuery, useSubmitter} from "../../../../util/hooks/observable";
import {gamesService} from "../../../../data/games/games.service";
import {useState} from "react";
import {useResetState} from "../../../../util/hooks/state";
import {eventsService} from "../../../../data/events/events.service";
import {DialogInteractions, DialogState} from "../../../common/Dialog";
import {ViewModel} from "../../../../util/viewmodel";


export interface NoteEventDialogState extends DialogState {
    note: string,
    location: string,
    locations: string[]
}

export interface NoteEventDialogInteractions extends DialogInteractions {
    onChangeNote: (text: string) => void
    onChangeLocation: (location: string) => void
}

export type NoteEventDialogViewModel = ViewModel<NoteEventDialogState, NoteEventDialogInteractions>

export function useNoteEventDialogViewModel(
    run: NuzlockeRun,
    notify: NotificationFN
): NoteEventDialogViewModel {

    const locationRegistry = useQuery(() => gamesService.getGameLocationRegistry$(run.game), undefined, [])
    const locations = locationRegistry?.getLocationNames() ?? []

    const [open, setOpen] = useState(false)
    const [note, setNote, resetNote] = useResetState("")
    const [location, setLocation, resetLocation] = useResetState("")

    const closeDialog = () => {
        setOpen(false)
        resetNote()
        resetLocation()
    }

    const onSuccess = () => {
        notify("Note created successfully", "success")
        closeDialog()
    }

    const onError = (e: any) => notify(`Failed to create note: '${e.response.data.reason}'`, "error")

    const submit = useSubmitter(() => eventsService.createNoteEvent$(run.id, {
        location: location,
        text: note
    }), onSuccess, onError)

    return {
        state: {
            open: open,
            note: note,
            location: location,
            locations: locations
        },
        interactions: {
            closeDialog: closeDialog,
            openDialog: () => setOpen(true),
            onChangeNote: setNote,
            onChangeLocation: setLocation,
            submit: submit
        }
    }
}
