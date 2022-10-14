import {fireEvent, render, screen, within} from "@testing-library/react";
import {MilestoneInput} from "./MilestoneInput";
import {MILESTONE, MILESTONE_2} from "../../../../data/games/games.testconstants";

describe("MilestoneInput", () => {
    const onChangeMilestone = jest.fn()

    function renderComponent() {
        render(<MilestoneInput
            onChangeMilestone={onChangeMilestone}
            milestone={MILESTONE}
            milestones={[MILESTONE, MILESTONE_2]}
        />)
    }

    it("should select a milestone", () => {
        renderComponent()
        const milestoneInput = screen.getByTestId("milestone-input")

        fireEvent.change(within(milestoneInput).getByRole("combobox"), {target: {value: "Bould"}})
        fireEvent.keyDown(milestoneInput, {key: "ArrowDown"})
        fireEvent.keyDown(milestoneInput, {key: "Enter"})

        expect(onChangeMilestone).toHaveBeenCalledTimes(1)
        expect(onChangeMilestone).toHaveBeenCalledWith(MILESTONE_2)
    })
})