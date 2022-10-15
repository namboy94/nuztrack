import axios from "axios-observable";
import {
    MULTI_RUN_CREATOR_TO,
    MULTI_RUN_OPTION_TO,
    NUZLOCKE_RUN_2_TO,
    NUZLOCKE_RUN_CREATOR_TO,
    NUZLOCKE_RUN_TO
} from "./runs.testconstants";
import {buildResponse} from "../../util/axios";
import {runsApi} from "./runs.api";

describe("API Tests for /runs", () => {

    afterEach(() => {
        jest.resetAllMocks()
    })

    it("should test getRuns", (done) => {
        const expected = buildResponse([NUZLOCKE_RUN_TO, NUZLOCKE_RUN_2_TO])
        const getMock = jest.spyOn(axios, "get").mockReturnValue(expected)
        runsApi.getRuns$().subscribe({
            next: x => {
                expect(x).toEqual([NUZLOCKE_RUN_TO, NUZLOCKE_RUN_2_TO])
            },
            complete: () => {
                expect(getMock).toHaveBeenCalledWith(`/api/runs`)
                expect(getMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should test getRun", (done) => {
        const getMock = jest.spyOn(axios, "get").mockReturnValue(buildResponse(NUZLOCKE_RUN_TO))
        runsApi.getRun$(NUZLOCKE_RUN_TO.id).subscribe({
            next: x => {
                expect(x).toEqual(NUZLOCKE_RUN_TO)
            },
            complete: () => {
                expect(getMock).toHaveBeenCalledWith(`/api/runs/${NUZLOCKE_RUN_TO.id}`)
                expect(getMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should test postRun", (done) => {
        const postMock = jest.spyOn(axios, "post").mockReturnValue(buildResponse(NUZLOCKE_RUN_TO))
        runsApi.postRun$(NUZLOCKE_RUN_CREATOR_TO).subscribe({
            next: x => {
                expect(x).toEqual(NUZLOCKE_RUN_TO)
            },
            complete: () => {
                expect(postMock).toHaveBeenCalledWith(`/api/runs`, NUZLOCKE_RUN_CREATOR_TO)
                expect(postMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should test deleteRun", (done) => {
        const deleteMock = jest.spyOn(axios, "delete").mockReturnValue(buildResponse(null))
        runsApi.deleteRun$(NUZLOCKE_RUN_TO.id).subscribe({
            next: x => {
                expect(x).toEqual(null)
            },
            complete: () => {
                expect(deleteMock).toHaveBeenCalledWith(`/api/runs/${NUZLOCKE_RUN_TO.id}`)
                expect(deleteMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should test postMultiRun", (done) => {
        const postMock = jest.spyOn(axios, "post").mockReturnValue(buildResponse(NUZLOCKE_RUN_TO))
        runsApi.postMultiRun$(MULTI_RUN_CREATOR_TO).subscribe({
            next: x => {
                expect(x).toEqual(NUZLOCKE_RUN_TO)
            },
            complete: () => {
                expect(postMock).toHaveBeenCalledWith(`/api/runs/multi`, MULTI_RUN_CREATOR_TO)
                expect(postMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should test getMultiRunOptions", (done) => {
        const postMock = jest.spyOn(axios, "get").mockReturnValue(buildResponse([MULTI_RUN_OPTION_TO]))
        runsApi.getMultiRunOptions$().subscribe({
            next: x => {
                expect(x).toEqual([MULTI_RUN_OPTION_TO])
            },
            complete: () => {
                expect(postMock).toHaveBeenCalledWith("/api/runs/multi/options")
                expect(postMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
})