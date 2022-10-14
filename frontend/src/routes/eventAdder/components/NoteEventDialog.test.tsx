import {NoteEventDialog} from "./NoteEventDialog";
import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {NoteEventDialogViewModel} from "../hooks/vm/NoteEventDialog.hooks";

describe("NoteEventDialog", () => {

    const onChangeLocation = jest.fn()
    const openDialog = jest.fn()
    const closeDialog = jest.fn()
    const submit = jest.fn()
    const onChangeNote = jest.fn()

    function renderComponent(): NoteEventDialogViewModel {
        const vm: NoteEventDialogViewModel = {
            state: {
                open: true,
                location: "Location",
                locations: LOCATION_REGISTRY.getLocationNames(),
                note: "Note"
            },
            interactions: {
                closeDialog: closeDialog,
                openDialog: openDialog,
                onChangeNote: onChangeNote,
                onChangeLocation: onChangeLocation,
                submit: submit
            }
        }
        render(<NoteEventDialog {...vm} />)
        return vm
    }

    it("should render all components correctly", () => {
        const props = renderComponent()

        const locationInput = screen.getByTestId("location-input")
        const noteInput = screen.getByTestId("note-text-input")
        const submitButton = screen.getByTestId("submit-button")
        const cancelButton = screen.getByTestId("cancel-button")

        expect(locationInput).toBeInTheDocument()
        expect(noteInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
        expect(cancelButton).toBeInTheDocument()

        expect(within(locationInput).getByRole("combobox").getAttribute("value"))
            .toEqual(props.state.location)
        expect(within(noteInput).getByRole("textbox").textContent).toEqual(props.state.note)
    })
    it("should enter note text", () => {
        renderComponent()
        const textInput = screen.getByTestId("note-text-input")
        act(() => {
            fireEvent.change(within(textInput).getByRole("textbox"), {target: {value: "AAAAA"}})
        })
        expect(onChangeNote).toHaveBeenCalledTimes(1)
        expect(onChangeNote).toHaveBeenCalledWith("AAAAA")
    })
    it("should submit", () => {
        renderComponent()
        const submitButton = screen.getByTestId("submit-button")

        act(() => {
            fireEvent.click(submitButton)
        })

        expect(submit).toHaveBeenCalledTimes(1)
    })
    it("should cancel", () => {
        renderComponent()
        const cancelButton = screen.getByTestId("cancel-button")

        act(() => {
            fireEvent.click(cancelButton)
        })

        expect(closeDialog).toHaveBeenCalledTimes(1)
    })
})