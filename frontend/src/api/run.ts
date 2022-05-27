import {NuzlockeRun} from "./objects/NuzlockeRun";
import axios from "axios";

export function loadRuns(): Promise<NuzlockeRun[]> {
    return axios.get("/api/runs").then(x => x.data)
}