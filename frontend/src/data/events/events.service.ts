import {eventsApi} from "./events.api";
import {eventsRepository} from "./events.repository";
import {eventsConverter} from "./events.convert";
import {ignoreElements, map, Observable, tap} from "rxjs";
import {
    CreateDeathEvent,
    CreateEncounterEvent,
    CreateEvolutionEvent,
    CreateMilestoneEvent,
    CreateNoteEvent,
    CreateTeamMemberSwitchEvent,
    DeathEvent,
    EncounterEvent,
    Event,
    EventType,
    EvolutionEvent,
    MilestoneEvent,
    NoteEvent,
    TeamMemberSwitchEvent
} from "./events.model";

class EventsService {
    private api = eventsApi
    private repo = eventsRepository
    private converter = eventsConverter

    loadEvents$(runId: number): Observable<never> {
        return this.api.getEvents$(runId).pipe(
            map(eventLog => this.converter.convertEventLogTOEventList(eventLog)),
            tap(events => this.repo.setEvents(events)),
            ignoreElements()
        )
    }

    getEvents$(runId: number): Observable<Event[]> {
        return this.repo.queryEvents$(runId)
    }

    getEncounterEvents$(runId: number): Observable<EncounterEvent[]> {
        return this.repo.queryEventsByEventType$(runId, EventType.ENCOUNTER).pipe(
            map(events => events.map(event => event as EncounterEvent))
        )
    }

    getDeathEvents$(runId: number): Observable<DeathEvent[]> {
        return this.repo.queryEventsByEventType$(runId, EventType.DEATH).pipe(
            map(events => events.map(event => event as DeathEvent))
        )
    }

    getEvolutionEvents$(runId: number): Observable<EvolutionEvent[]> {
        return this.repo.queryEventsByEventType$(runId, EventType.EVOLUTION).pipe(
            map(events => events.map(event => event as EvolutionEvent))
        )
    }

    getMilestoneEvents$(runId: number): Observable<MilestoneEvent[]> {
        return this.repo.queryEventsByEventType$(runId, EventType.MILESTONE).pipe(
            map(events => events.map(event => event as MilestoneEvent))
        )
    }

    getNoteEvents$(runId: number): Observable<NoteEvent[]> {
        return this.repo.queryEventsByEventType$(runId, EventType.NOTE).pipe(
            map(events => events.map(event => event as NoteEvent))
        )
    }

    getTeamMemberSwitchEvents$(runId: number): Observable<TeamMemberSwitchEvent[]> {
        return this.repo.queryEventsByEventType$(runId, EventType.TEAM_MEMBER_SWITCH).pipe(
            map(events => events.map(event => event as TeamMemberSwitchEvent))
        )
    }

    createEncounterEvent$(runId: number, creator: CreateEncounterEvent): Observable<EncounterEvent> {
        // TODO Update team after encounter
        const to = this.converter.convertCreateEncounterEventModelToTO(creator)
        return this.api.postEncounterEvent$(runId, to).pipe(
            map(eventTO => this.converter.convertEncounterEventTOToModel(eventTO)),
            tap(event => this.repo.addEvent(event))
        )
    }

    createDeathEvent$(runId: number, creator: CreateDeathEvent): Observable<DeathEvent> {
        // TODO Update team when death occurs
        const to = this.converter.convertCreateDeathEventModelToTO(creator)
        return this.api.postDeathEvent$(runId, to).pipe(
            map(eventTO => this.converter.convertDeathEventTOToModel(eventTO)),
            tap(event => this.repo.addEvent(event))
        )
    }

    createEvolutionEvent$(runId: number, creator: CreateEvolutionEvent): Observable<EvolutionEvent> {
        // TODO Update team when evolving
        const to = this.converter.convertCreateEvolutionEventModelToTO(creator)
        return this.api.postEvolutionEvent$(runId, to).pipe(
            map(eventTO => this.converter.convertEvolutionEventTOToModel(eventTO)),
            tap(event => this.repo.addEvent(event))
        )
    }

    createMilestoneEvent$(runId: number, creator: CreateMilestoneEvent): Observable<MilestoneEvent> {
        const to = this.converter.convertCreateMilestoneEventModelToTO(creator)
        return this.api.postMilestoneEvent$(runId, to).pipe(
            map(eventTO => this.converter.convertMilestoneEventTOToModel(eventTO)),
            tap(event => this.repo.addEvent(event))
        )
    }

    createNoteEvent$(runId: number, creator: CreateNoteEvent): Observable<NoteEvent> {
        const to = this.converter.convertCreateNoteEventModelToTO(creator)
        return this.api.postNoteEvent$(runId, to).pipe(
            map(eventTO => this.converter.convertNoteEventTOToModel(eventTO)),
            tap(event => this.repo.addEvent(event))
        )
    }

    createTeamMemberSwitchEvent$(
        runId: number, creator: CreateTeamMemberSwitchEvent
    ): Observable<TeamMemberSwitchEvent> {
        // TODO Update team when switching out or in
        const to = this.converter.convertCreateTeamMemberSwitchEventModelToTO(creator)
        return this.api.postTeamMemberSwitchEvent$(runId, to).pipe(
            map(eventTO => this.converter.convertTeamMemberSwitchEventTOToModel(eventTO)),
            tap(event => this.repo.addEvent(event))
        )
    }

}

export const eventsService = new EventsService()