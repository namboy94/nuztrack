import {EncounterEvent} from "./encounter/encounterEventTypes";
import {DeathEvent} from "./death/deathEventTypes";
import {EvolutionEvent} from "./evolution/evolutionEventTypes";
import {TeamMemberSwitchEvent} from "./team_member_switch/teamMemberSwitchEventTypes";
import {NoteEvent} from "./note/noteEventTypes";
import {MilestoneEvent} from "./milestone/milestoneEventTypes";

export type Event = {
    id: number,
    runId: number,
    timestamp: string,
    location: string
}

export type EventLog = {
    encounters: EncounterEvent[],
    deaths: DeathEvent[],
    evolutions: EvolutionEvent[],
    teamMemberSwitches: TeamMemberSwitchEvent[],
    notes: NoteEvent[],
    milestones: MilestoneEvent[]
}