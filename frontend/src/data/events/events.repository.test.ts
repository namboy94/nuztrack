import {
    ENCOUNTER_EVENT_FAILED,
    ENCOUNTER_EVENT_SUCCESSFUL,
    EVENT_LIST,
    MILESTONE_EVENT,
    NOTE_EVENT
} from "./events.testconstants";
import {eventsRepository} from "./events.repository";
import {EventType} from "./events.model";

describe("EventsRepository", () => {

    const runId = EVENT_LIST[0].runId

    beforeEach(() => {
        eventsRepository.setEvents(EVENT_LIST)
    })

    it("should get all events", (done) => {
        eventsRepository.queryEvents$(runId).subscribe({
            next: result => {
                expect(result).toEqual(EVENT_LIST)
                done()
            }
        })
    })

    it("should get no events if using another run ID", (done) => {
        eventsRepository.queryEvents$(12345).subscribe({
            next: result => {
                expect(result).toEqual([])
                done()
            }
        })
    })

    it("should get events by event type", (done) => {
        eventsRepository.queryEventsByEventType$(runId, EventType.ENCOUNTER).subscribe({
            next: result => {
                expect(result).toEqual([ENCOUNTER_EVENT_SUCCESSFUL, ENCOUNTER_EVENT_FAILED])
                done()
            }
        })
    })

    it("should add events", (done) => {
        eventsRepository.setEvents([])
        eventsRepository.addEvent(ENCOUNTER_EVENT_SUCCESSFUL)
        eventsRepository.addEvent(NOTE_EVENT)
        eventsRepository.addEvent(MILESTONE_EVENT)
        eventsRepository.queryEvents$(runId).subscribe({
            next: result => {
                expect(result).toEqual([ENCOUNTER_EVENT_SUCCESSFUL, NOTE_EVENT, MILESTONE_EVENT])
                done()
            }
        })
    })
})