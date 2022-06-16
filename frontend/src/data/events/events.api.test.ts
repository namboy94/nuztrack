import axios from "axios-observable";
import {buildResponse} from "../../util/test/axios";
import {
    CREATE_DEATH_EVENT_TO,
    CREATE_ENCOUNTER_EVENT_TO,
    CREATE_EVOLUTION_EVENT_TO,
    CREATE_MILESTONE_EVENT_TO,
    CREATE_NOTE_EVENT_TO,
    CREATE_TEAM_MEMBER_SWITCH_EVENT_TO,
    DEATH_EVENT_TO,
    ENCOUNTER_EVENT_SUCCESSFUL_TO,
    EVENT_LOG_TO,
    EVOLUTION_EVENT_TO,
    MILESTONE_EVENT_TO,
    NOTE_EVENT_TO,
    TEAM_MEMBER_SWITCH_EVENT_TO
} from "./events.testconstants";
import {eventsApi} from "./events.api";

describe("EventsApi", () => {
    it("should test retrieving all events", (done) => {
        const getMock = jest.spyOn(axios, "get").mockReturnValue(buildResponse(EVENT_LOG_TO))
        eventsApi.getEvents$(1).subscribe({
            next: x => {
                expect(x).toEqual(EVENT_LOG_TO)
            },
            complete: () => {
                expect(getMock).toHaveBeenCalledWith(`/api/events/1`)
                expect(getMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should test POST a new Encounter Event", (done) => {
        const postMock = jest.spyOn(axios, "post").mockReturnValue(buildResponse(ENCOUNTER_EVENT_SUCCESSFUL_TO))
        eventsApi.postEncounterEvent$(1, CREATE_ENCOUNTER_EVENT_TO).subscribe({
            next: x => {
                expect(x).toEqual(ENCOUNTER_EVENT_SUCCESSFUL_TO)
            },
            complete: () => {
                expect(postMock).toHaveBeenCalledWith(`/api/events/1/encounters`, CREATE_ENCOUNTER_EVENT_TO)
                expect(postMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should test POST a new Death Event", (done) => {
        const postMock = jest.spyOn(axios, "post").mockReturnValue(buildResponse(DEATH_EVENT_TO))
        eventsApi.postDeathEvent$(1, CREATE_DEATH_EVENT_TO).subscribe({
            next: x => {
                expect(x).toEqual(DEATH_EVENT_TO)
            },
            complete: () => {
                expect(postMock).toHaveBeenCalledWith(`/api/events/1/deaths`, CREATE_DEATH_EVENT_TO)
                expect(postMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should test POST a new Evolution Event", (done) => {
        const postMock = jest.spyOn(axios, "post").mockReturnValue(buildResponse(EVOLUTION_EVENT_TO))
        eventsApi.postEvolutionEvent$(1, CREATE_EVOLUTION_EVENT_TO).subscribe({
            next: x => {
                expect(x).toEqual(EVOLUTION_EVENT_TO)
            },
            complete: () => {
                expect(postMock).toHaveBeenCalledWith(`/api/events/1/evolutions`, CREATE_EVOLUTION_EVENT_TO)
                expect(postMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should test POST a new Milestone Event", (done) => {
        const postMock = jest.spyOn(axios, "post").mockReturnValue(buildResponse(MILESTONE_EVENT_TO))
        eventsApi.postMilestoneEvent$(1, CREATE_MILESTONE_EVENT_TO).subscribe({
            next: x => {
                expect(x).toEqual(MILESTONE_EVENT_TO)
            },
            complete: () => {
                expect(postMock).toHaveBeenCalledWith(`/api/events/1/milestones`, CREATE_MILESTONE_EVENT_TO)
                expect(postMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should test POST a new Note Event", (done) => {
        const postMock = jest.spyOn(axios, "post").mockReturnValue(buildResponse(NOTE_EVENT_TO))
        eventsApi.postNoteEvent$(1, CREATE_NOTE_EVENT_TO).subscribe({
            next: x => {
                expect(x).toEqual(NOTE_EVENT_TO)
            },
            complete: () => {
                expect(postMock).toHaveBeenCalledWith(`/api/events/1/notes`, CREATE_NOTE_EVENT_TO)
                expect(postMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should test POST a new TeamMemberSwitch Event", (done) => {
        const postMock = jest.spyOn(axios, "post").mockReturnValue(buildResponse(TEAM_MEMBER_SWITCH_EVENT_TO))
        eventsApi.postTeamMemberSwitchEvent$(1, CREATE_TEAM_MEMBER_SWITCH_EVENT_TO).subscribe({
            next: x => {
                expect(x).toEqual(TEAM_MEMBER_SWITCH_EVENT_TO)
            },
            complete: () => {
                expect(postMock).toHaveBeenCalledWith(
                    `/api/events/1/team_member_switches`, CREATE_TEAM_MEMBER_SWITCH_EVENT_TO
                )
                expect(postMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
})