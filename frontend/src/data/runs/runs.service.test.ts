import {runsApi} from "./runs.api";
import {of} from "rxjs";
import {
    NUZLOCKE_RUN,
    NUZLOCKE_RUN_2_TO,
    NUZLOCKE_RUN_CREATOR,
    NUZLOCKE_RUN_CREATOR_TO,
    NUZLOCKE_RUN_TO
} from "./runs.testconstants";
import {runsRepository} from "./runs.repository";
import {runsService} from "./runs.service";

describe("RunsService", () => {
    it("should fill the repository", (done) => {
        const runs = [NUZLOCKE_RUN_TO, NUZLOCKE_RUN_2_TO]
        const apiMock = jest.spyOn(runsApi, "getRuns$").mockReturnValue(of(runs))
        const repoMock = jest.spyOn(runsRepository, "fillRuns").mockImplementation()
        runsService.loadRuns$().subscribe({
            complete: () => {
                expect(apiMock).toHaveBeenCalledTimes(1)
                expect(repoMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should get all runs", (done) => {
        const apiMock = jest.spyOn(runsApi, "getRuns$").mockImplementation()
        const repoMock = jest.spyOn(runsRepository, "queryRuns$").mockReturnValue(of([NUZLOCKE_RUN]))
        runsService.getRuns$().subscribe({
            next: result => {
                expect(result).toEqual([NUZLOCKE_RUN])
            },
            complete: () => {
                expect(apiMock).toHaveBeenCalledTimes(0)
                expect(repoMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should get a run", (done) => {
        const apiMock = jest.spyOn(runsApi, "getRun$").mockImplementation()
        const repoMock = jest.spyOn(runsRepository, "queryRun$").mockReturnValue(of(NUZLOCKE_RUN))
        runsService.getRun$(NUZLOCKE_RUN.id).subscribe({
            next: result => {
                expect(result).toEqual(NUZLOCKE_RUN)
            },
            complete: () => {
                expect(apiMock).toHaveBeenCalledTimes(0)
                expect(repoMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should create a run", (done) => {
        const apiMock = jest.spyOn(runsApi, "postRun$").mockReturnValue(of(NUZLOCKE_RUN_TO))
        const repoMock = jest.spyOn(runsRepository, "addRun").mockImplementation()
        runsService.addRun$(NUZLOCKE_RUN_CREATOR).subscribe({
            next: result => {
                expect(result).toEqual(NUZLOCKE_RUN)
            },
            complete: () => {
                expect(apiMock).toHaveBeenCalledTimes(1)
                expect(apiMock).toHaveBeenCalledWith(NUZLOCKE_RUN_CREATOR_TO)
                expect(repoMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should delete a run", (done) => {
        const apiMock = jest.spyOn(runsApi, "deleteRun$").mockReturnValue(of(null))
        const repoMock = jest.spyOn(runsRepository, "deleteRun").mockImplementation()
        runsService.deleteRun$(NUZLOCKE_RUN.id).subscribe({
            complete: () => {
                expect(apiMock).toHaveBeenCalledTimes(1)
                expect(repoMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should retrieve the active run", (done) => {
        const repoMock = jest.spyOn(runsRepository, "queryActiveRun$").mockReturnValue(of(NUZLOCKE_RUN))
        runsService.getActiveRun$().subscribe({
            next: result => {
                expect(result).toEqual(NUZLOCKE_RUN)
                expect(repoMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should set the active run", (done) => {
        const repoMock = jest.spyOn(runsRepository, "setActiveRun").mockImplementation()
        runsService.selectActiveRun(NUZLOCKE_RUN)
        expect(repoMock).toHaveBeenCalledTimes(1)
        expect(repoMock).toHaveBeenCalledWith(NUZLOCKE_RUN)
        done()
    })
    it("should unset the active run", (done) => {
        const repoMock = jest.spyOn(runsRepository, "setActiveRun").mockImplementation()
        runsService.closeActiveRun()
        expect(repoMock).toHaveBeenCalledTimes(1)
        expect(repoMock).toHaveBeenCalledWith(undefined)
        done()
    })
})