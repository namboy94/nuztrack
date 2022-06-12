import axios from "axios-observable";
import {map, Observable} from "rxjs";
import {NuzlockeRunCreatorTO, NuzlockeRunTO} from "./runs.transfer";

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
}

export const runsApi = new RunsApi()