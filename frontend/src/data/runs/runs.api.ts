import axios from "axios-observable";
import {map, Observable} from "rxjs";
import {CreateMultiRunTO, MultiRunOptionTO, NuzlockeRunCreatorTO, NuzlockeRunTO} from "./runs.transfer";

class RunsApi {
    getRuns$(): Observable<NuzlockeRunTO[]> {
        return axios.get("/api/runs").pipe(map(x => x.data))
    }

    getRun$(id: number): Observable<NuzlockeRunTO> {
        return axios.get(`/api/runs/${id}`).pipe(map(x => x.data))
    }

    postRun$(creator: NuzlockeRunCreatorTO): Observable<NuzlockeRunTO> {
        return axios.post("/api/runs", creator).pipe(map(x => x.data))
    }

    deleteRun$(id: number): Observable<null> {
        return axios.delete(`/api/runs/${id}`).pipe(map(() => null))
    }

    postMultiRun$(creator: CreateMultiRunTO): Observable<NuzlockeRunTO> {
        return axios.post("/api/runs/multi", creator).pipe(map(x => x.data))
    }

    getMultiRunOptions$(): Observable<MultiRunOptionTO[]> {
        return axios.get("/api/runs/multi/options").pipe(map(x => x.data))
    }
}

export const runsApi = new RunsApi()