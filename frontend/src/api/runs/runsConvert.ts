import {CreateNuzlockeRun, CreateNuzlockeRunTO, NuzlockeRun, NuzlockeRunTO} from "./runsTypes";

export function convertNuzlockeRunTOToNuzlockeRun(nuzlockeRunTO: NuzlockeRunTO): NuzlockeRun {
    return {...nuzlockeRunTO}
}

export function convertCreateNuzlockeRunTOCreateNuzlockeRun(
    createNuzlockeRunTO: CreateNuzlockeRunTO
): CreateNuzlockeRun {
    return {...createNuzlockeRunTO}
}