import {MilestoneList, MilestoneListProps} from "./MilestoneList";
import {MILESTONE, MILESTONE_2} from "../../../data/games/games.testconstants";
import {MILESTONE_EVENT} from "../../../data/events/events.testconstants";
import {render} from "@testing-library/react";

describe("MilestoneList", () => {

    function renderComponent() {
        const props: MilestoneListProps = {
            milestones: [MILESTONE, MILESTONE_2],
            userMilestones: [MILESTONE_EVENT],
            addMilestone: jest.fn()
        }
        render(<MilestoneList {...props}/>)
    }

    it("should display the MilestoneList", (done) => {
        done()
    })
})