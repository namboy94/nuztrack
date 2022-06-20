import {NoteEventDialog, NoteEventDialogProps, NoteEventDialogState} from "./NoteEventDialog";
import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";

describe("NoteEventDialog", () => {

    const reset = jest.fn()
    const setLocation = jest.fn()
    const setText = jest.fn()
    const onClose = jest.fn()
    const submit = jest.fn()

    function renderComponent(): NoteEventDialogProps {
        const state: NoteEventDialogState = {
            location: "Location",
            text: "Text",
            reset: reset,
            setLocation: setLocation,
            setText: setText
        }
        const props: NoteEventDialogProps = {
            locations: LOCATION_REGISTRY.getLocationNames(),
            open: true,
            state: state,
            submit: submit,
            onClose: onClose
        }
        render(<NoteEventDialog {...props}/>)
        return props
    }

    it("should render all UI elements correctly", (done) => {
        renderComponent()

        const locationInput = screen.getByTestId("location-input")
        const textInput = screen.getByTestId("note-text-input")
        const submitButton = screen.getByTestId("submit-button")
        const cancelButton = screen.getByTestId("cancel-button")

        expect(locationInput).toBeInTheDocument()
        expect(textInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
        expect(cancelButton).toBeInTheDocument()

        expect(within(locationInput).getByRole("combobox").getAttribute("value")).toEqual("Location")
        expect(within(textInput).getByRole("textbox").textContent).toEqual("Text")

        done()
    })
    it("should select a location", (done) => {
        renderComponent()
        const locationInput = screen.getByTestId("location-input")
        act(() => {
            fireEvent.change(within(locationInput).getByRole("combobox"), {target: {value: "AAAAA"}})
            fireEvent.keyDown(locationInput, {key: "Enter"})
        })
        expect(setLocation).toHaveBeenCalledTimes(1)
        expect(setLocation).toHaveBeenCalledWith("AAAAA")
        done()
    })
    it("should enter note text", (done) => {
        renderComponent()
        const textInput = screen.getByTestId("note-text-input")
        act(() => {
            fireEvent.change(within(textInput).getByRole("textbox"), {target: {value: "AAAAA"}})
        })
        expect(setText).toHaveBeenCalledTimes(1)
        expect(setText).toHaveBeenCalledWith("AAAAA")
        done()
    })
    it("should submit", (done) => {
        renderComponent()
        const submitButton = screen.getByTestId("submit-button")

        act(() => {
            fireEvent.click(submitButton)
        })

        expect(submit).toHaveBeenCalledTimes(1)
        done()
    })
    it("should cancel", (done) => {
        renderComponent()
        const cancelButton = screen.getByTestId("cancel-button")

        act(() => {
            fireEvent.click(cancelButton)
        })

        expect(onClose).toHaveBeenCalledTimes(1)
        done()
    })
})