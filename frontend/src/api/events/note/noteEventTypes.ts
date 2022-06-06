import {Event} from "../eventTypes"

export type NoteEvent = {
    event: Event,
    text: string,
}

export type CreateNoteEvent = {
    location: string,
    text: string
}