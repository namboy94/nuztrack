import axios from "axios";
import {CreateNuzlockeRun, NuzlockeRun, NuzlockeRunTO} from "./runsTypes";
import {convertCreateNuzlockeRunTOCreateNuzlockeRun, convertNuzlockeRunTOToNuzlockeRun} from "./runsConvert";

export function loadRuns(): Promise<NuzlockeRun[]> {
    return axios.get("/api/runs").then(
        x => x.data.map((run: NuzlockeRunTO) => convertNuzlockeRunTOToNuzlockeRun(run))
    )
}

export function loadRun(id: number): Promise<NuzlockeRun | null> {
    return axios.get(`/api/runs/${id}`).then(
        x => convertNuzlockeRunTOToNuzlockeRun(x.data), () => null
    )
}

export function createRun(creator: CreateNuzlockeRun): Promise<NuzlockeRun> {
    const creatorTO = convertCreateNuzlockeRunTOCreateNuzlockeRun(creator)
    return axios.post("/api/runs", creatorTO).then(
        x => convertNuzlockeRunTOToNuzlockeRun(x.data)
    )
}

export function deleteRun(id: number): Promise<void> {
    return axios.delete(`/api/runs/${id}`)
}
