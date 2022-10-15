import {CreateMultiRunTO, MultiRunOptionTO, NuzlockeRunCreatorTO, NuzlockeRunTO} from "./runs.transfer";
import {CreateMultiRun, MultiRunOption, NuzlockeRun, NuzlockeRunCreator, RunStatus} from "./runs.model";

export const NUZLOCKE_RUN_TO: NuzlockeRunTO = {
    customRules: ["Meowth has 9 Lives"],
    game: {
        title: "FireRed",
        key: "FIRERED",
        generation: 3
    },
    id: 5,
    name: "My first Nuzlocke",
    rules: ["DEATH"],
    status: "ACTIVE",
    username: "Ash"
}
export const NUZLOCKE_RUN: NuzlockeRun = {
    customRules: ["Meowth has 9 Lives"],
    game: {
        title: "FireRed",
        key: "FIRERED",
        generation: 3
    },
    id: 5,
    name: "My first Nuzlocke",
    rules: ["DEATH"],
    status: RunStatus.ACTIVE,
    username: "Ash"
}
export const NUZLOCKE_RUN_2_TO: NuzlockeRunTO = {
    customRules: ["Max Revives may be used"],
    game: {
        title: "HeartGold",
        key: "HEARTGOLD",
        generation: 4
    },
    id: 8,
    name: "My second Nuzlocke",
    rules: ["DEATH", "NICKNAME"],
    status: "FAILED",
    username: "Gold"
}
export const NUZLOCKE_RUN_2: NuzlockeRun = {
    customRules: ["Max Revives may be used"],
    game: {
        title: "HeartGold",
        key: "HEARTGOLD",
        generation: 4
    },
    id: 8,
    name: "My second Nuzlocke",
    rules: ["DEATH", "NICKNAME"],
    status: RunStatus.FAILED,
    username: "Gold"
}
export const NUZLOCKE_RUN_CREATOR_TO: NuzlockeRunCreatorTO = {
    customRules: ["Meowth has 9 Lives"],
    game: "FIRERED",
    name: "My first Nuzlocke",
    rules: ["DEATH"]
}
export const NUZLOCKE_RUN_CREATOR: NuzlockeRunCreator = {
    customRules: ["Meowth has 9 Lives"],
    game: {
        title: "FireRed",
        key: "FIRERED",
        generation: 3
    },
    name: "My first Nuzlocke",
    rules: ["DEATH"]
}
export const MULTI_RUN_CREATOR_TO: CreateMultiRunTO = {
    game: "FIRERED",
    name: "My next Multirun part",
    options: [],
    runId: 1
}
export const MULTI_RUN_CREATOR: CreateMultiRun = {
    game: {
        title: "FireRed",
        key: "FIRERED",
        generation: 3
    },
    name: "My next Multirun part",
    options: [],
    runId: 1
}
export const MULTI_RUN_OPTION_TO: MultiRunOptionTO = {
    key: "Key",
    description: "Description"
}
export const MULTI_RUN_OPTION: MultiRunOption = MULTI_RUN_OPTION_TO
