import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {MILESTONE, MILESTONE_2} from "../../../data/games/games.testconstants";
import {MilestoneEventDialog, MilestoneEventDialogProps, MilestoneEventDialogState} from "./MilestoneEventDialog";

describe("MilestoneEventDialog", () => {

    const reset = jest.fn()
    const setMilestone = jest.fn()
    const onClose = jest.fn()
    const submit = jest.fn()

    function renderComponent(): MilestoneEventDialogProps {
        const state: MilestoneEventDialogState = {
            reset: reset,
            setMilestone: setMilestone,
            milestone: MILESTONE
        }
        const props: MilestoneEventDialogProps = {
            open: true,
            state: state,
            submit: submit,
            onClose: onClose,
            milestones: [MILESTONE, MILESTONE_2]
        }
        render(<MilestoneEventDialog {...props}/>)
        return props
    }

    it("should render all UI elements correctly", (done) => {
        renderComponent()

        const milestoneInput = screen.getByTestId("milestone-input")
        const submitButton = screen.getByTestId("submit-button")
        const cancelButton = screen.getByTestId("cancel-button")

        expect(milestoneInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
        expect(cancelButton).toBeInTheDocument()

        expect(within(milestoneInput).getByRole("combobox").getAttribute("value")).toEqual(MILESTONE.name)

        done()
    })
    it("should select a milestone", (done) => {
        renderComponent()
        const milestoneInput = screen.getByTestId("milestone-input")

        fireEvent.change(within(milestoneInput).getByRole("combobox"), {target: {value: "Bould"}})
        fireEvent.keyDown(milestoneInput, {key: "ArrowDown"})
        fireEvent.keyDown(milestoneInput, {key: "Enter"})

        expect(setMilestone).toHaveBeenCalledTimes(1)
        expect(setMilestone).toHaveBeenCalledWith(MILESTONE_2)
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