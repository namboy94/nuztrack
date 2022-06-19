import {useNoteEventDialogProps} from "./NoteEventDialog.hooks";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";

describe("useNoteEventDialogProps", () => {
    it("should", (done) => {
        const _ = () => useNoteEventDialogProps(NUZLOCKE_RUN, jest.fn())
        done()
    })
})