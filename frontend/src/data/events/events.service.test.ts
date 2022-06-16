import {eventsApi} from "./events.api";
import {of} from "rxjs";
import {
    CREATE_DEATH_EVENT,
    CREATE_DEATH_EVENT_TO,
    CREATE_ENCOUNTER_EVENT,
    CREATE_ENCOUNTER_EVENT_TO,
    CREATE_EVOLUTION_EVENT,
    CREATE_EVOLUTION_EVENT_TO,
    CREATE_MILESTONE_EVENT,
    CREATE_MILESTONE_EVENT_TO,
    CREATE_NOTE_EVENT,
    CREATE_NOTE_EVENT_TO,
    CREATE_TEAM_MEMBER_SWITCH_EVENT,
    CREATE_TEAM_MEMBER_SWITCH_EVENT_TO,
    DEATH_EVENT,
    DEATH_EVENT_TO,
    ENCOUNTER_EVENT_FAILED,
    ENCOUNTER_EVENT_SUCCESSFUL,
    ENCOUNTER_EVENT_SUCCESSFUL_TO,
    EVENT_LIST,
    EVENT_LOG_TO,
    EVOLUTION_EVENT,
    EVOLUTION_EVENT_TO,
    MILESTONE_EVENT,
    MILESTONE_EVENT_TO,
    NOTE_EVENT,
    NOTE_EVENT_TO,
    TEAM_MEMBER_SWITCH_EVENT,
    TEAM_MEMBER_SWITCH_EVENT_TO
} from "./events.testconstants";
import {eventsService} from "./events.service";
import {eventsRepository} from "./events.repository";
import {EventType} from "./events.model";

describe("EventsService", () => {

    const runId = EVENT_LIST[0].runId

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("should load the events", (done) => {
        jest.spyOn(eventsApi, "getEvents$").mockReturnValue(of(EVENT_LOG_TO))
        jest.spyOn(eventsRepository, "setEvents").mockImplementation(jest.fn())
        eventsService.loadEvents$(runId).subscribe({
            complete: () => {
                expect(eventsApi.getEvents$).toHaveBeenCalledTimes(1)
                expect(eventsApi.getEvents$).toHaveBeenCalledWith(runId)
                expect(eventsRepository.setEvents).toHaveBeenCalledTimes(1)
                expect(eventsRepository.setEvents).toHaveBeenCalledWith(EVENT_LIST)
                done()
            }
        })
    })
    it("should get the events", (done) => {
        jest.spyOn(eventsRepository, "queryEvents$").mockReturnValue(of(EVENT_LIST))
        eventsService.getEvents$(runId).subscribe({
            next: result => {
                expect(result).toEqual(EVENT_LIST)
                expect(eventsRepository.queryEvents$).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should get all encounter events", (done) => {
        jest.spyOn(eventsRepository, "queryEventsByEventType$").mockReturnValue(
            of([ENCOUNTER_EVENT_SUCCESSFUL, ENCOUNTER_EVENT_FAILED])
        )
        eventsService.getEncounterEvents$(runId).subscribe({
            next: result => {
                expect(result).toEqual([ENCOUNTER_EVENT_SUCCESSFUL, ENCOUNTER_EVENT_FAILED])
                expect(eventsRepository.queryEventsByEventType$).toHaveBeenCalledTimes(1)
                expect(eventsRepository.queryEventsByEventType$).toHaveBeenCalledWith(runId, EventType.ENCOUNTER)
                done()
            }
        })
    })
    it("should get all death events", (done) => {
        jest.spyOn(eventsRepository, "queryEventsByEventType$").mockReturnValue(
            of([DEATH_EVENT])
        )
        eventsService.getDeathEvents$(runId).subscribe({
            next: result => {
                expect(result).toEqual([DEATH_EVENT])
                expect(eventsRepository.queryEventsByEventType$).toHaveBeenCalledTimes(1)
                expect(eventsRepository.queryEventsByEventType$).toHaveBeenCalledWith(runId, EventType.DEATH)
                done()
            }
        })
    })
    it("should get all evolution events", (done) => {
        jest.spyOn(eventsRepository, "queryEventsByEventType$").mockReturnValue(
            of([EVOLUTION_EVENT])
        )
        eventsService.getEvolutionEvents$(runId).subscribe({
            next: result => {
                expect(result).toEqual([EVOLUTION_EVENT])
                expect(eventsRepository.queryEventsByEventType$).toHaveBeenCalledTimes(1)
                expect(eventsRepository.queryEventsByEventType$).toHaveBeenCalledWith(runId, EventType.EVOLUTION)
                done()
            }
        })
    })
    it("should get all milestone events", (done) => {
        jest.spyOn(eventsRepository, "queryEventsByEventType$").mockReturnValue(
            of([MILESTONE_EVENT])
        )
        eventsService.getMilestoneEvents$(runId).subscribe({
            next: result => {
                expect(result).toEqual([MILESTONE_EVENT])
                expect(eventsRepository.queryEventsByEventType$).toHaveBeenCalledTimes(1)
                expect(eventsRepository.queryEventsByEventType$).toHaveBeenCalledWith(runId, EventType.MILESTONE)
                done()
            }
        })
    })
    it("should get all note events", (done) => {
        jest.spyOn(eventsRepository, "queryEventsByEventType$").mockReturnValue(
            of([NOTE_EVENT])
        )
        eventsService.getNoteEvents$(runId).subscribe({
            next: result => {
                expect(result).toEqual([NOTE_EVENT])
                expect(eventsRepository.queryEventsByEventType$).toHaveBeenCalledTimes(1)
                expect(eventsRepository.queryEventsByEventType$).toHaveBeenCalledWith(runId, EventType.NOTE)
                done()
            }
        })
    })
    it("should get all team member switch events", (done) => {
        jest.spyOn(eventsRepository, "queryEventsByEventType$").mockReturnValue(
            of([TEAM_MEMBER_SWITCH_EVENT])
        )
        eventsService.getTeamMemberSwitchEvents$(runId).subscribe({
            next: result => {
                expect(result).toEqual([TEAM_MEMBER_SWITCH_EVENT])
                expect(eventsRepository.queryEventsByEventType$).toHaveBeenCalledTimes(1)
                expect(eventsRepository.queryEventsByEventType$).toHaveBeenCalledWith(
                    runId, EventType.TEAM_MEMBER_SWITCH
                )
                done()
            }
        })
    })
    it("should create an encounter event", (done) => {
        jest.spyOn(eventsApi, "postEncounterEvent$").mockReturnValue(of(ENCOUNTER_EVENT_SUCCESSFUL_TO))
        jest.spyOn(eventsRepository, "addEvent").mockImplementation(jest.fn())
        eventsService.createEncounterEvent$(runId, CREATE_ENCOUNTER_EVENT).subscribe({
            next: result => {
                expect(result).toEqual(ENCOUNTER_EVENT_SUCCESSFUL)
                expect(eventsApi.postEncounterEvent$).toHaveBeenCalledTimes(1)
                expect(eventsApi.postEncounterEvent$).toHaveBeenCalledWith(runId, CREATE_ENCOUNTER_EVENT_TO)
                expect(eventsRepository.addEvent).toHaveBeenCalledTimes(1)
                expect(eventsRepository.addEvent).toHaveBeenCalledWith(ENCOUNTER_EVENT_SUCCESSFUL)
                done()
            }
        })
    })
    it("should create a death event", (done) => {
        jest.spyOn(eventsApi, "postDeathEvent$").mockReturnValue(of(DEATH_EVENT_TO))
        jest.spyOn(eventsRepository, "addEvent").mockImplementation(jest.fn())
        eventsService.createDeathEvent$(runId, CREATE_DEATH_EVENT).subscribe({
            next: result => {
                expect(result).toEqual(DEATH_EVENT)
                expect(eventsApi.postDeathEvent$).toHaveBeenCalledTimes(1)
                expect(eventsApi.postDeathEvent$).toHaveBeenCalledWith(runId, CREATE_DEATH_EVENT_TO)
                expect(eventsRepository.addEvent).toHaveBeenCalledTimes(1)
                expect(eventsRepository.addEvent).toHaveBeenCalledWith(DEATH_EVENT)
                done()
            }
        })
    })
    it("should create a evolution event", (done) => {
        jest.spyOn(eventsApi, "postEvolutionEvent$").mockReturnValue(of(EVOLUTION_EVENT_TO))
        jest.spyOn(eventsRepository, "addEvent").mockImplementation(jest.fn())
        eventsService.createEvolutionEvent$(runId, CREATE_EVOLUTION_EVENT).subscribe({
            next: result => {
                expect(result).toEqual(EVOLUTION_EVENT)
                expect(eventsApi.postEvolutionEvent$).toHaveBeenCalledTimes(1)
                expect(eventsApi.postEvolutionEvent$).toHaveBeenCalledWith(runId, CREATE_EVOLUTION_EVENT_TO)
                expect(eventsRepository.addEvent).toHaveBeenCalledTimes(1)
                expect(eventsRepository.addEvent).toHaveBeenCalledWith(EVOLUTION_EVENT)
                done()
            }
        })
    })
    it("should create a milestone event", (done) => {
        jest.spyOn(eventsApi, "postMilestoneEvent$").mockReturnValue(of(MILESTONE_EVENT_TO))
        jest.spyOn(eventsRepository, "addEvent").mockImplementation(jest.fn())
        eventsService.createMilestoneEvent$(runId, CREATE_MILESTONE_EVENT).subscribe({
            next: result => {
                expect(result).toEqual(MILESTONE_EVENT)
                expect(eventsApi.postMilestoneEvent$).toHaveBeenCalledTimes(1)
                expect(eventsApi.postMilestoneEvent$).toHaveBeenCalledWith(runId, CREATE_MILESTONE_EVENT_TO)
                expect(eventsRepository.addEvent).toHaveBeenCalledTimes(1)
                expect(eventsRepository.addEvent).toHaveBeenCalledWith(MILESTONE_EVENT)
                done()
            }
        })
    })
    it("should create a note event", (done) => {
        jest.spyOn(eventsApi, "postNoteEvent$").mockReturnValue(of(NOTE_EVENT_TO))
        jest.spyOn(eventsRepository, "addEvent").mockImplementation(jest.fn())
        eventsService.createNoteEvent$(runId, CREATE_NOTE_EVENT).subscribe({
            next: result => {
                expect(result).toEqual(NOTE_EVENT)
                expect(eventsApi.postNoteEvent$).toHaveBeenCalledTimes(1)
                expect(eventsApi.postNoteEvent$).toHaveBeenCalledWith(runId, CREATE_NOTE_EVENT_TO)
                expect(eventsRepository.addEvent).toHaveBeenCalledTimes(1)
                expect(eventsRepository.addEvent).toHaveBeenCalledWith(NOTE_EVENT)
                done()
            }
        })
    })
    it("should create a Team Member Switch event", (done) => {
        jest.spyOn(eventsApi, "postTeamMemberSwitchEvent$").mockReturnValue(of(TEAM_MEMBER_SWITCH_EVENT_TO))
        jest.spyOn(eventsRepository, "addEvent").mockImplementation(jest.fn())
        eventsService.createTeamMemberSwitchEvent$(runId, CREATE_TEAM_MEMBER_SWITCH_EVENT).subscribe({
            next: result => {
                expect(result).toEqual(TEAM_MEMBER_SWITCH_EVENT)
                expect(eventsApi.postTeamMemberSwitchEvent$).toHaveBeenCalledTimes(1)
                expect(eventsApi.postTeamMemberSwitchEvent$).toHaveBeenCalledWith(
                    runId, CREATE_TEAM_MEMBER_SWITCH_EVENT_TO
                )
                expect(eventsRepository.addEvent).toHaveBeenCalledTimes(1)
                expect(eventsRepository.addEvent).toHaveBeenCalledWith(TEAM_MEMBER_SWITCH_EVENT)
                done()
            }
        })
    })
})