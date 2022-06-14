import {runsRepository} from "./runs.repository";
import {NUZLOCKE_RUN, NUZLOCKE_RUN_2} from "./runs.testconstants";

describe("Runs Repository", () => {

    beforeEach(() => {
        runsRepository.fill([NUZLOCKE_RUN, NUZLOCKE_RUN_2])
    })

    it("should query all runs", (done) => {
        runsRepository.queryRuns$().subscribe({
            next: result => {
                expect(result).toEqual([NUZLOCKE_RUN, NUZLOCKE_RUN_2])
                done()
            }
        })
    })
    it("should query a single run", (done) => {
        runsRepository.queryRun$(NUZLOCKE_RUN_2.id).subscribe({
            next: result => {
                expect(result).toEqual(NUZLOCKE_RUN_2)
                done()
            }
        })
    })
    it("should add a single run", (done) => {
        runsRepository.clear()
        runsRepository.addRun(NUZLOCKE_RUN_2)
        runsRepository.queryRuns$().subscribe({
            next: results => {
                expect(results.length).toEqual(1)
                done()
            }
        })
    })
    it("should update an existing run", (done) => {
        runsRepository.addRun({...NUZLOCKE_RUN, name: "NewName"})
        runsRepository.queryRun$(NUZLOCKE_RUN.id).subscribe({
            next: result => {
                expect(result?.name).toEqual("NewName")
                done()
            }
        })
    })
    it("should delete an existing run", (done) => {
        runsRepository.deleteRun(NUZLOCKE_RUN.id)
        runsRepository.queryRun$(NUZLOCKE_RUN.id).subscribe({
            next: result => {
                expect(result).toBeUndefined()
                done()
            }
        })
    })
    it("should not delete a not-existing run", (done) => {
        runsRepository.deleteRun(1000)
        runsRepository.queryRuns$().subscribe({
            next: results => {
                expect(results.length).toEqual(2)
                done()
            }
        })
    })
    it("should select a Nuzlocke Run", (done) => {
        runsRepository.setActiveRun(NUZLOCKE_RUN)
        runsRepository.queryActiveRun$().subscribe({
            next: result => {
                expect(result).toEqual(NUZLOCKE_RUN)
                done()
            }
        })
        runsRepository.setActiveRun(NUZLOCKE_RUN_2)
        runsRepository.queryActiveRun$().subscribe({next: result => expect(result).toEqual(NUZLOCKE_RUN)})
    })
    it("should select a new Nuzlocke Run", (done) => {
        runsRepository.setActiveRun(NUZLOCKE_RUN)

        runsRepository.setActiveRun(NUZLOCKE_RUN_2)
        runsRepository.queryActiveRun$().subscribe({
            next: result => {
                expect(result).toEqual(NUZLOCKE_RUN_2)
                done()
            }
        })
    })
})