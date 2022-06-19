import {NoteEventDialog} from "./NoteEventDialog";
import {useNoteEventDialogProps} from "../hooks/NoteEventDialog.hooks";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";

describe("NoteEventDialog", () => {
    it("should", (done) => {
        const _ = () => useNoteEventDialogProps(NUZLOCKE_RUN, jest.fn())
        done()
    })
})