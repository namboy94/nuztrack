import {render, screen} from "@testing-library/react";
import {NoteLogEntry} from "./NoteLogEntry";
import {NOTE_EVENT} from "../../../../data/events/events.testconstants";

describe("NoteLogEntry", () => {

    function renderComponent() {
        render(<NoteLogEntry event={NOTE_EVENT}/>)
    }

    it("should display the event correctly", () => {
        renderComponent()
        const entry = screen.getByTestId("note-log-entry")

        expect(entry).toBeInTheDocument()
        expect(entry.textContent).toContain(NOTE_EVENT.text)
        expect(entry.textContent).toContain(NOTE_EVENT.location)
    })

})