import {render, screen, within} from "@testing-library/react";
import {MILESTONE, MILESTONE_2} from "../../../data/games/games.testconstants";
import {MilestoneEventDialog} from "./MilestoneEventDialog";
import {MilestoneEventDialogViewModel} from "../hooks/vm/MilestoneEventDialog.hooks";

describe("MilestoneEventDialog", () => {

    const openDialog = jest.fn()
    const closeDialog = jest.fn()
    const submit = jest.fn()
    const onChangeMilestone = jest.fn()

    function renderComponent(): MilestoneEventDialogViewModel {
        const vm: MilestoneEventDialogViewModel = {
            state: {
                open: true,
                milestone: MILESTONE,
                milestones: [MILESTONE, MILESTONE_2]
            },
            interactions: {
                closeDialog: closeDialog,
                openDialog: openDialog,
                submit: submit,
                onChangeMilestone: onChangeMilestone
            }
        }
        render(<MilestoneEventDialog {...vm} />)
        return vm
    }

    it("should render all UI elements correctly", () => {
        renderComponent()

        const milestoneInput = screen.getByTestId("milestone-input")
        const submitButton = screen.getByTestId("submit-button")
        const cancelButton = screen.getByTestId("cancel-button")

        expect(milestoneInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
        expect(cancelButton).toBeInTheDocument()

        expect(within(milestoneInput).getByRole("combobox").getAttribute("value"))
            .toEqual(MILESTONE.name)
    })
})