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
import {localStorageStrategy, persistState} from "@ngneat/elf-persist-state";

class RunsRepository {
    private runsStore = createStore(
        {name: "runs"},
        withEntities<NuzlockeRun, "id">({idKey: "id"})
    )

    private activeRunStore = createStore(
        {name: "activeRun"},
        withEntities<NuzlockeRun, "id">({idKey: "id"})
    )
    private activeRunPersistence = persistState(
        this.activeRunStore,
        {key: "activeRun", storage: localStorageStrategy}
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
        this.activeRunStore.update(deleteEntities(runId))
    }

    setActiveRun(run: NuzlockeRun | undefined) {
        if (run === undefined) {
            this.activeRunStore.update(setEntities([]))
        } else {
            this.activeRunStore.update(setEntities([run]))
        }
    }
}

export const runsRepository = new RunsRepository()
