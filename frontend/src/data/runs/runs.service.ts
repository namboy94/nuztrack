import {runsApi} from "./runs.api";
import {runsRepository} from "./runs.repository";
import {ignoreElements, map, Observable, tap} from "rxjs";
import {runsConverter} from "./runs.convert";
import {NuzlockeRun, NuzlockeRunCreator} from "./runs.model";

class RunsService {
    private api = runsApi
    private repo = runsRepository
    private converter = runsConverter

    loadRuns$(): Observable<never> {
        return this.api.getRuns$().pipe(
            map(runTos => runTos.map(x => this.converter.convertNuzlockeRunTOToModel(x))),
            tap((runs: NuzlockeRun[]) => this.repo.fill(runs)),
            ignoreElements()
        )
    }

    getRuns$(): Observable<NuzlockeRun[]> {
        return this.repo.queryRuns$()
    }

    getRun$(runId: number): Observable<NuzlockeRun | undefined> {
        return this.repo.queryRun$(runId)
    }

    addRun$(runCreator: NuzlockeRunCreator): Observable<NuzlockeRun> {
        const creatorTO = this.converter.convertNuzlockeRunCreatorModelToTO(runCreator)
        return this.api.postRun$(creatorTO).pipe(
            map(runTO => this.converter.convertNuzlockeRunTOToModel(runTO)),
            tap(run => this.repo.addRun(run))
        )
    }

    deleteRun$(runId: number): Observable<never> {
        return this.api.deleteRun$(runId).pipe(
            tap(() => this.repo.deleteRun(runId)),
            ignoreElements()
        )
    }
}

export const runsService = new RunsService()