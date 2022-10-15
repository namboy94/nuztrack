import {render, screen} from "@testing-library/react";
import {MilestoneLogEntry} from "./MilestoneLogEntry";
import {MILESTONE_EVENT} from "../../../../data/events/events.testconstants";
import {LOCATION_REGISTRY} from "../../../../data/games/games.testconstants";

describe("MilestoneLogEntry", () => {

    function renderComponent() {
        render(<MilestoneLogEntry event={MILESTONE_EVENT} locationRegistry={LOCATION_REGISTRY}/>)
    }

    it("should display the event correctly", () => {
        renderComponent()
        const entry = screen.getByTestId("milestone-log-entry")

        expect(entry).toBeInTheDocument()
        expect(entry.textContent).toContain(`Acquired the '${MILESTONE_EVENT.milestone}' Milestone`)
        expect(entry.textContent).toContain(MILESTONE_EVENT.location)
    })

})