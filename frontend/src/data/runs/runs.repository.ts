import {createStore} from '@ngneat/elf';
import {
    deleteEntities,
    selectAllEntities,
    selectEntity,
    selectFirst,
    setEntities,
    upsertEntities,
    withEntities
} from "@ngneat/elf-entities";
import {NuzlockeRun} from "./runs.model";
import {Observable} from "rxjs";

class RunsRepository {
    private runsStore = createStore(
        {name: "runs"},
        withEntities<NuzlockeRun, "id">({idKey: "id"})
    )

    private activeRunStore = createStore(
        {name: "activeRun"},
        withEntities<NuzlockeRun, "id">({idKey: "id"})
    )

    clear() {
        this.fill([])
    }

    fill(runs: NuzlockeRun[]) {
        this.runsStore.update(setEntities(runs))
    }

    queryRuns$(): Observable<NuzlockeRun[]> {
        return this.runsStore.pipe(selectAllEntities())
    }

    queryRun$(runId: number): Observable<NuzlockeRun | undefined> {
        return this.runsStore.pipe(selectEntity(runId))
    }

    queryActiveRun$(): Observable<NuzlockeRun | undefined> {
        return this.activeRunStore.pipe(selectFirst())
    }

    addRun(run: NuzlockeRun) {
        this.runsStore.update(upsertEntities(run))
    }

    deleteRun(runId: number) {
        this.runsStore.update(deleteEntities(runId))
    }

    setActiveRun(run: NuzlockeRun) {
        this.activeRunStore.update(setEntities([run]))
    }
}

export const runsRepository = new RunsRepository()
