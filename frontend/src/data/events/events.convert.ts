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
    SwitchType,
    TeamMemberSwitchEvent
} from "./events.model";
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
import {Gender} from "../team/team.model";

class EventsConverter {
    convertEventLogTOEventList(to: EventLogTO): Event[] {
        return [
            ...to.deaths.map(x => this.convertDeathEventTOToModel(x)),
            ...to.encounters.map(x => this.convertEncounterEventTOToModel(x)),
            ...to.evolutions.map(x => this.convertEvolutionEventTOToModel(x)),
            ...to.milestones.map(x => this.convertMilestoneEventTOToModel(x)),
            ...to.notes.map(x => this.convertNoteEventTOToModel(x)),
            ...to.teamMemberSwitches.map(x => this.convertTeamMemberSwitchEventTOToModel(x))
        ]
    }

    convertEncounterEventTOToModel(to: EncounterEventTO): EncounterEvent {
        const {event, ...info} = to
        return {...info, ...event, timestamp: new Date(event.timestamp), type: EventType.ENCOUNTER}
    }

    convertDeathEventTOToModel(to: DeathEventTO): DeathEvent {
        const {event, ...info} = to
        return {...info, ...event, timestamp: new Date(event.timestamp), type: EventType.DEATH}
    }

    convertEvolutionEventTOToModel(to: EvolutionEventTO): EvolutionEvent {
        const {event, ...info} = to
        return {...info, ...event, timestamp: new Date(event.timestamp), type: EventType.EVOLUTION}
    }

    convertMilestoneEventTOToModel(to: MilestoneEventTO): MilestoneEvent {
        const {event, ...info} = to
        return {...info, ...event, timestamp: new Date(event.timestamp), type: EventType.MILESTONE}
    }

    convertNoteEventTOToModel(to: NoteEventTO): NoteEvent {
        const {event, ...info} = to
        return {...info, ...event, timestamp: new Date(event.timestamp), type: EventType.NOTE}
    }

    convertTeamMemberSwitchEventTOToModel(to: TeamMemberSwitchEventTO): TeamMemberSwitchEvent {
        const {event, ...info} = to
        const switchType = SwitchType[info.switchType as keyof typeof SwitchType]
        return {
            ...info,
            ...event,
            timestamp: new Date(event.timestamp),
            switchType: switchType,
            type: EventType.TEAM_MEMBER_SWITCH
        }
    }

    convertCreateEncounterEventModelToTO(model: CreateEncounterEvent): CreateEncounterEventTO {
        return {...model, pokemon: {...model.pokemon, gender: Gender[model.pokemon.gender]}}
    }

    convertCreateDeathEventModelToTO(model: CreateDeathEvent): CreateDeathEventTO {
        return {...model}
    }

    convertCreateEvolutionEventModelToTO(model: CreateEvolutionEvent): CreateEvolutionEventTO {
        return {...model}
    }

    convertCreateMilestoneEventModelToTO(model: CreateMilestoneEvent): CreateMilestoneEventTO {
        return {...model}
    }

    convertCreateNoteEventModelToTO(model: CreateNoteEvent): CreateNoteEventTO {
        return {...model}
    }

    convertCreateTeamMemberSwitchEventModelToTO(model: CreateTeamMemberSwitchEvent): CreateTeamMemberSwitchEventTO {
        return {...model, switchType: SwitchType[model.switchType]}
    }

}

export const eventsConverter = new EventsConverter()