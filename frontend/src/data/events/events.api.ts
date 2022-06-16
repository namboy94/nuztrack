import {map, Observable} from "rxjs";
import {
    CreateDeathEventTO,
    CreateEncounterEventTO,
    CreateEvolutionEventTO,
    CreateMilestoneEventTO,
    CreateNoteEventTO,
    CreateTeamMemberSwitchEventTO,
    DeathEventTO,
    EncounterEventTO,
    EventLogTO,
    EvolutionEventTO,
    MilestoneEventTO,
    NoteEventTO,
    TeamMemberSwitchEventTO
} from "./events.transfer";
import axios from "axios-observable";


class EventsApi {
    getEvents$(runId: number): Observable<EventLogTO> {
        return axios.get(`/api/events/${runId}`).pipe(map(x => x.data))
    }

    postEncounterEvent$(runId: number, event: CreateEncounterEventTO): Observable<EncounterEventTO> {
        return axios.post(`/api/events/${runId}/encounters`, event).pipe(map(x => x.data))
    }

    postDeathEvent$(runId: number, event: CreateDeathEventTO): Observable<DeathEventTO> {
        return axios.post(`/api/events/${runId}/deaths`, event).pipe(map(x => x.data))
    }

    postEvolutionEvent$(runId: number, event: CreateEvolutionEventTO): Observable<EvolutionEventTO> {
        return axios.post(`/api/events/${runId}/evolutions`, event).pipe(map(x => x.data))
    }

    postNoteEvent$(runId: number, event: CreateNoteEventTO): Observable<NoteEventTO> {
        return axios.post(`/api/events/${runId}/notes`, event).pipe(map(x => x.data))
    }

    postMilestoneEvent$(runId: number, event: CreateMilestoneEventTO): Observable<MilestoneEventTO> {
        return axios.post(`/api/events/${runId}/milestones`, event).pipe(map(x => x.data))
    }

    postTeamMemberSwitchEvent$(runId: number, event: CreateTeamMemberSwitchEventTO): Observable<TeamMemberSwitchEventTO> {
        return axios.post(`/api/events/${runId}/team_member_switches`, event).pipe(map(x => x.data))
    }
}

export const eventsApi = new EventsApi()