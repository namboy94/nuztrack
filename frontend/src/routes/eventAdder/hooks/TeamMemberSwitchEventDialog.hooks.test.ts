import {useTeamMemberSwitchEventDialogProps} from "./TeamMemberSwitchEventDialog.hooks";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {of, throwError} from "rxjs";
import {gamesService} from "../../../data/games/games.service";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {act, renderHook} from "@testing-library/react";
import {TeamMemberSwitchEventDialogProps} from "../components/TeamMemberSwitchEventDialog";
import {eventsService} from "../../../data/events/events.service";
import {TEAM_MEMBER_SWITCH_EVENT} from "../../../data/events/events.testconstants";
import {CreateTeamMemberSwitchEvent, SwitchType} from "../../../data/events/events.model";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {teamService} from "../../../data/team/team.service";
import {TEAM_MEMBER_1, TEAM_MEMBER_3} from "../../../data/team/team.testconstants";
import {createMocksForTeamMemberEventViewModel} from "./vm/TeamMemberEvent.vm.test";

type PropsGetter = () => TeamMemberSwitchEventDialogProps

describe("useTeamMemberSwitchEventDialogProps", () => {

    const notify = jest.fn()

    function createMocksAndRender(mode: SwitchType = SwitchType.ADD): [() => void, PropsGetter] {
        createMocksForTeamMemberEventViewModel()
        const result = renderHook(() => useTeamMemberSwitchEventDialogProps(NUZLOCKE_RUN, notify, mode)).result
        return [result.current[0], () => result.current[1]]
    }

    function fillFields(propsGetter: PropsGetter) {
        const props = propsGetter()
        act(() => {
            props.state.setLocation("LOCATION")
            props.state.setTeamMember(TEAM_MEMBER_1)
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
    it("should submit successfully", (done) => {
        jest.spyOn(eventsService, "createTeamMemberSwitchEvent$").mockReturnValue(of(TEAM_MEMBER_SWITCH_EVENT))

        const [openFn, propsGetter] = createMocksAndRender()

        act(openFn)
        fillFields(propsGetter)
        act(propsGetter().submit)

        const expected: CreateTeamMemberSwitchEvent = {
            location: "LOCATION",
            teamMemberId: TEAM_MEMBER_1.id,
            switchType: SwitchType.ADD
        }

        expect(eventsService.createTeamMemberSwitchEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createTeamMemberSwitchEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
        done()
    })
    it("should submit unsuccessfully (add)", (done) => {
        jest.spyOn(eventsService, "createTeamMemberSwitchEvent$").mockReturnValue(throwError(() => {
            throw {response: {data: {reason: "TEST"}}}
        }))

        const [openFn, propsGetter] = createMocksAndRender()

        act(openFn)
        fillFields(propsGetter)
        act(propsGetter().submit)

        const expected: CreateTeamMemberSwitchEvent = {
            location: "LOCATION",
            teamMemberId: TEAM_MEMBER_1.id,
            switchType: SwitchType.ADD
        }

        expect(eventsService.createTeamMemberSwitchEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createTeamMemberSwitchEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith("Failed to add team member: 'TEST'", "error")
        done()
    })
    it("should submit unsuccessfully (remove)", (done) => {
        jest.spyOn(eventsService, "createTeamMemberSwitchEvent$").mockReturnValue(throwError(() => {
            throw {response: {data: {reason: "TEST"}}}
        }))

        const [openFn, propsGetter] = createMocksAndRender(SwitchType.REMOVE)

        act(openFn)
        fillFields(propsGetter)
        act(propsGetter().submit)

        const expected: CreateTeamMemberSwitchEvent = {
            location: "LOCATION",
            teamMemberId: TEAM_MEMBER_1.id,
            switchType: SwitchType.REMOVE
        }

        expect(eventsService.createTeamMemberSwitchEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createTeamMemberSwitchEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith("Failed to remove team member: 'TEST'", "error")
        done()
    })
})