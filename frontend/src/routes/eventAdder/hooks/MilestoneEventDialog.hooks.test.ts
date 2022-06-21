import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {of, throwError} from "rxjs";
import {gamesService} from "../../../data/games/games.service";
import {LOCATION_REGISTRY, MILESTONE} from "../../../data/games/games.testconstants";
import {act, renderHook} from "@testing-library/react";
import {eventsService} from "../../../data/events/events.service";
import {MILESTONE_EVENT} from "../../../data/events/events.testconstants";
import {CreateMilestoneEvent} from "../../../data/events/events.model";
import {MilestoneEventDialogProps} from "../components/MilestoneEventDialog";
import {useMilestoneEventDialogProps} from "./MilestoneEventDialog.hooks";

type PropsGetter = () => MilestoneEventDialogProps

describe("useMilestoneEventDialogProps", () => {

    const notify = jest.fn()

    function createMocksAndRender(run: NuzlockeRun): [() => void, PropsGetter] {
        jest.spyOn(gamesService, "getGameLocationRegistry$").mockReturnValue(of(LOCATION_REGISTRY))
        const result = renderHook(() => useMilestoneEventDialogProps(run, notify)).result
        return [result.current[0], () => result.current[1]]
    }

    it("should load the required data", (done) => {
        const props = createMocksAndRender(NUZLOCKE_RUN)[1]()
        expect(props.milestones).toEqual(LOCATION_REGISTRY.getMilestones())
        expect(gamesService.getGameLocationRegistry$).toHaveBeenCalledTimes(1)
        done()
    })
    it("should reset milestone when closing", (done) => {
        const [openFN, propsGetter] = createMocksAndRender(NUZLOCKE_RUN)
        act(openFN)

        let props = propsGetter()
        act(() => {
            props.state.setMilestone(MILESTONE)
        })
        props = propsGetter()

        expect(props.state.milestone).toEqual(MILESTONE)

        act(props.onClose)
        props = propsGetter()

        expect(props.state.milestone).toEqual(null)
        done()
    })
    it("should submit milestone successfully", (done) => {
        jest.spyOn(eventsService, "createMilestoneEvent$").mockReturnValue(of(MILESTONE_EVENT))
        const [openFN, propsGetter] = createMocksAndRender(NUZLOCKE_RUN)

        let props = propsGetter()
        act(() => {
            openFN()
            props.state.setMilestone(MILESTONE)
        })
        props = propsGetter()

        act(props.submit)

        const expected: CreateMilestoneEvent = {location: MILESTONE.location, milestone: MILESTONE.name}
        expect(eventsService.createMilestoneEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createMilestoneEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
        done()
    })
    it("should submit note unsuccessfully", (done) => {
        jest.spyOn(eventsService, "createMilestoneEvent$").mockReturnValue(throwError(() => {
            throw {response: {data: {reason: "TEST"}}}
        }))
        const [openFN, propsGetter] = createMocksAndRender(NUZLOCKE_RUN)

        let props = propsGetter()
        act(() => {
            openFN()
            props.state.setMilestone(MILESTONE)
        })
        props = propsGetter()

        act(props.submit)

        const expected: CreateMilestoneEvent = {location: MILESTONE.location, milestone: MILESTONE.name}
        expect(eventsService.createMilestoneEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createMilestoneEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith("Failed to add Milestone: 'TEST'", "error")
        done()
    })
})