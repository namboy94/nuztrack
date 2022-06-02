import axios from "axios";
import {CreateNuzlockeRun, NuzlockeRun} from "./runsTypes";

export function loadRuns(): Promise<NuzlockeRun[]> {
    return axios.get("/api/runs").then(x => x.data)
}

export function loadRun(id: number): Promise<NuzlockeRun | null> {
    return axios.get(`/api/runs/${id}`).then(x => x.data, () => null)
}

export function createRun(creator: CreateNuzlockeRun): Promise<NuzlockeRun> {
    return axios.post("/api/runs", creator).then(x => x.data)
}

export function deleteRun(id: number): Promise<void> {
    return axios.delete(`/api/runs/${id}`)
}
