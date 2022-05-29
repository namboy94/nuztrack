import axios from "axios";
import {CreateNuzlockeRunTO, NuzlockeRunTO} from "./runsTransfer";

export function loadRuns(): Promise<NuzlockeRunTO[]> {
    return axios.get("/api/runs").then(x => x.data)
}

export function loadRun(id: number): Promise<NuzlockeRunTO | undefined> {
    return axios.get(`/api/runs/${id}`).then(x => x.data, () => undefined)
}

export function createRun(creator: CreateNuzlockeRunTO): Promise<NuzlockeRunTO> {
    return axios.post("/api/runs", creator).then(x => x.data)
}

export function deleteRun(id: number): Promise<void> {
    return axios.delete(`/api/runs/${id}`)
}
