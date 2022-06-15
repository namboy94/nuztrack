import {useCloseRun} from "./closeRun.hook";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {runsService} from "../../../data/runs/runs.service";
import * as router from "react-router";

describe("useCloseRun", () => {
    it("should close a run and navigate to root", (done) => {
        const navigate = jest.fn();
        const notify = jest.fn()
        jest.spyOn(runsService, "closeActiveRun").mockImplementation(jest.fn())
        jest.spyOn(router, "useNavigate").mockReturnValue(navigate)

        const closeRun = useCloseRun(notify)
        closeRun(NUZLOCKE_RUN)

        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "info")
        expect(runsService.closeActiveRun).toHaveBeenCalledTimes(1)
        expect(navigate).toHaveBeenCalledTimes(1)
        expect(navigate).toHaveBeenCalledWith("/")
        done()
    })
})