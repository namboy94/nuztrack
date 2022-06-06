import axios from "axios";
import {CreateNoteEvent, NoteEvent} from "./noteEventTypes";

export function createNoteEvent(runId: number, creator: CreateNoteEvent): Promise<NoteEvent> {
    return axios.post(`/api/events/${runId}/notes`, creator).then(x => x.data)
}