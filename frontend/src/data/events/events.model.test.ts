import {DEATH_EVENT, EVENT_REGISTRY} from "./events.testconstants";
import {EventRegistry, EventType, NoteEvent} from "./events.model";

describe("EventRegistry", () => {
    it("should get an event by its ID", (done) => {
        expect(EVENT_REGISTRY.getEventById(DEATH_EVENT.id)).toEqual(DEATH_EVENT)
        done()
    })
    it("should get all events sorted by timestamp", (done) => {
        const eventOne: NoteEvent = {
            id: 1, location: "", runId: 1, text: "", type: EventType.NOTE,
            timestamp: new Date(2022, 1, 1)
        }
        const eventTwo: NoteEvent = {
            id: 2, location: "", runId: 2, text: "", type: EventType.NOTE,
            timestamp: new Date(2021, 1, 1)
        }
        const registry = new EventRegistry([eventOne, eventTwo])
        expect(registry.getAllEvents()).toEqual([eventTwo, eventOne])
        done()
    })
})