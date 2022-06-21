import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {of, throwError} from "rxjs";
import {POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {teamService} from "../../../data/team/team.service";
import {TEAM_MEMBER_1, TEAM_MEMBER_3} from "../../../data/team/team.testconstants";
import {gamesService} from "../../../data/games/games.service";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {act, renderHook} from "@testing-library/react";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {DeathEventDialogProps} from "../components/DeathEventDialog";
import {useDeathEventDialogProps} from "./DeathEventDialog.hooks";
import {eventsService} from "../../../data/events/events.service";
import {DEATH_EVENT} from "../../../data/events/events.testconstants";
import {CreateDeathEvent} from "../../../data/events/events.model";

type PropsGetter = () => DeathEventDialogProps

describe("useDeathEventDialogProps", () => {

    const notify = jest.fn()

    function createMocksAndRender(): [() => void, PropsGetter] {
        jest.spyOn(pokedexService, "getPokedex$").mockReturnValue(of(POKEDEX))
        jest.spyOn(teamService, "getActiveTeamMembers$").mockReturnValue(of([TEAM_MEMBER_1]))
        jest.spyOn(teamService, "getBoxedTeamMembers$").mockReturnValue(of([TEAM_MEMBER_3]))
        jest.spyOn(gamesService, "getGameLocationRegistry$").mockReturnValue(of(LOCATION_REGISTRY))
        const result = renderHook(() => useDeathEventDialogProps(NUZLOCKE_RUN, notify)).result
        return [result.current[0], () => result.current[1]]
    }

    function fillFields(propsGetter: PropsGetter) {
        const props = propsGetter()
        act(() => {
            props.state.setLocation("LOCATION")
            props.state.setTeamMember(TEAM_MEMBER_1)
            props.state.setLevel(16)
            props.state.setOpponent("OPPONENT")
            props.state.setDescription("DESCRIPTION")
        })
    }

    it("should test loading the data", (done) => {
        const props = createMocksAndRender()[1]()

        expect(props.pokedex).toEqual(POKEDEX)
        expect(props.activeTeamMembers).toEqual([TEAM_MEMBER_1])
        expect(props.boxedTeamMembers).toEqual([TEAM_MEMBER_3])
        expect(props.locations).toEqual(LOCATION_REGISTRY.getLocationNames())

        expect(pokedexService.getPokedex$).toHaveBeenCalledTimes(1)
        expect(teamService.getActiveTeamMembers$).toHaveBeenCalledTimes(1)
        expect(teamService.getBoxedTeamMembers$).toHaveBeenCalledTimes(1)
        expect(gamesService.getGameLocationRegistry$).toHaveBeenCalledTimes(1)
        done()
    })
    it("should reset level if team member is switched", (done) => {
        const [openFn, propsGetter] = createMocksAndRender()

        act(openFn)
        fillFields(propsGetter)

        let props = propsGetter()
        act(() => props.state.setTeamMember(TEAM_MEMBER_3))
        props = propsGetter()

        expect(props.state.level).toEqual(TEAM_MEMBER_3.level)

        done()
    })
    it("should submit successfully", (done) => {
        jest.spyOn(eventsService, "createDeathEvent$").mockReturnValue(of(DEATH_EVENT))

        const [openFn, propsGetter] = createMocksAndRender()

        act(openFn)
        fillFields(propsGetter)
        act(propsGetter().submit)

        const expected: CreateDeathEvent = {
            location: "LOCATION",
            teamMemberId: TEAM_MEMBER_1.id,
            level: 16,
            opponent: "OPPONENT",
            description: "DESCRIPTION"
        }

        expect(eventsService.createDeathEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createDeathEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
        done()
    })
    it("should submit unsuccessfully", (done) => {
        jest.spyOn(eventsService, "createDeathEvent$").mockReturnValue(throwError(() => {
            throw {response: {data: {reason: "TEST"}}}
        }))

        const [openFn, propsGetter] = createMocksAndRender()

        act(openFn)
        fillFields(propsGetter)
        act(propsGetter().submit)

        expect(eventsService.createDeathEvent$).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith("Failed to create Death Event: 'TEST'", "error")
        done()
    })
})