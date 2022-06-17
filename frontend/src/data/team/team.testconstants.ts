import {TeamMemberTO, TeamTO} from "./team.transfer";
import {Gender, TeamMember, TeamState} from "./team.model";

export const TEAM_MEMBER_1_TO: TeamMemberTO = {
    abilitySlot: 1,
    deathId: null,
    encounterId: 1,
    evolutionIds: [],
    gender: "MALE",
    id: 1,
    level: 5,
    nature: "BOLD",
    nickname: "Bubbles",
    pokedexNumber: 7,
    teamSwitchIds: []
}
export const TEAM_MEMBER_1: TeamMember = {
    teamState: TeamState.ACTIVE,
    runId: 1,
    abilitySlot: 1,
    deathId: null,
    encounterId: 1,
    evolutionIds: [],
    gender: Gender.MALE,
    id: 1,
    level: 5,
    nature: "BOLD",
    nickname: "Bubbles",
    pokedexNumber: 7,
    teamSwitchIds: []
}
export const TEAM_MEMBER_2_TO: TeamMemberTO = {
    abilitySlot: null,
    deathId: 2,
    encounterId: 2,
    evolutionIds: [],
    gender: null,
    id: 2,
    level: 5,
    nature: null,
    nickname: "Char",
    pokedexNumber: 4,
    teamSwitchIds: [2]
}
export const TEAM_MEMBER_2: TeamMember = {
    runId: 1,
    teamState: TeamState.DEAD,
    abilitySlot: null,
    deathId: 2,
    encounterId: 2,
    evolutionIds: [],
    gender: null,
    id: 2,
    level: 5,
    nature: null,
    nickname: "Char",
    pokedexNumber: 4,
    teamSwitchIds: [2]
}
export const TEAM_MEMBER_3_TO: TeamMemberTO = {
    abilitySlot: 3,
    deathId: null,
    encounterId: 3,
    evolutionIds: [3],
    gender: "FEMALE",
    id: 3,
    level: 5,
    nature: "MODEST",
    nickname: "Bulba",
    pokedexNumber: 2,
    teamSwitchIds: [3, 4, 5]
}
export const TEAM_MEMBER_3: TeamMember = {
    runId: 1,
    teamState: TeamState.BOXED,
    abilitySlot: 3,
    deathId: null,
    encounterId: 3,
    evolutionIds: [3],
    gender: Gender.FEMALE,
    id: 3,
    level: 5,
    nature: "MODEST",
    nickname: "Bulba",
    pokedexNumber: 2,
    teamSwitchIds: [3, 4, 5]
}
export const TEAM_TO: TeamTO = {
    active: [TEAM_MEMBER_1_TO],
    boxed: [TEAM_MEMBER_3_TO],
    dead: [TEAM_MEMBER_2_TO]
}
export const TEAM: TeamMember[] = [
    TEAM_MEMBER_1,
    TEAM_MEMBER_3,
    TEAM_MEMBER_2,
]