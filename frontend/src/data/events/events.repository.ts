import {createStore} from "@ngneat/elf";
import {addEntities, selectAllEntitiesApply, setEntities, withEntities} from "@ngneat/elf-entities";
import {Event, EventType} from "./events.model";
import {Observable} from "rxjs";

class EventsRepository {
    private eventStore = createStore(
        {name: "events"},
        withEntities<Event, "id">({idKey: "id"})
    )

    setEvents(events: Event[]) {
        this.eventStore.update(setEntities(events))
    }

    addEvent(event: Event) {
        this.eventStore.update(addEntities(event))
    }

    queryEvents$(runId: number): Observable<Event[]> {
        return this.eventStore.pipe(selectAllEntitiesApply({
            filterEntity: e => e.runId === runId
        }))
    }

    queryEventsByEventType$(runId: number, eventType: EventType): Observable<Event[]> {
        return this.eventStore.pipe(selectAllEntitiesApply({
            filterEntity: (e) => e.runId === runId && e.type === eventType
        }))
    }
}

export const eventsRepository = new EventsRepository()
