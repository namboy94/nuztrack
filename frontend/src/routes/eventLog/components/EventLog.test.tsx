import {EventLogViewModel} from "../hooks/vm/EventLog.vm";
import {POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {TEAM} from "../../../data/team/team.testconstants";
import {EVENT_REGISTRY} from "../../../data/events/events.testconstants";
import {render, screen} from "@testing-library/react";
import {EventLog} from "./EventLog";

describe("EventLog", () => {

    function renderComponent() {
        const vm: EventLogViewModel = {
            state: {
                pokedex: POKEDEX,
                locationRegistry: LOCATION_REGISTRY,
                team: TEAM,
                eventRegistry: EVENT_REGISTRY
            },
            interactions: {}
        }
        render(<EventLog {...vm}/>)
    }

    it("should render all events", () => {
        renderComponent()
        expect(screen.getAllByTestId("encounter-log-entry").length).toEqual(2)
        expect(screen.getAllByTestId("evolution-log-entry").length).toEqual(1)
        expect(screen.getAllByTestId("death-log-entry").length).toEqual(1)
        expect(screen.getAllByTestId("team-member-switch-log-entry").length).toEqual(2)
        expect(screen.getAllByTestId("note-log-entry").length).toEqual(1)
        expect(screen.getAllByTestId("milestone-log-entry").length).toEqual(1)
    })

})