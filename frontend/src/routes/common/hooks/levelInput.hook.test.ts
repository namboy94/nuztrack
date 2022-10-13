import {act, renderHook} from "@testing-library/react";
import {useLevelInput} from "./levelInput.hook";

describe("useLevelInput", () => {

    function render() {
        return renderHook(() => useLevelInput(5)).result
    }

    it("should accept valid inputs", () => {
        const hookresult = render()

        act(() => hookresult.current[1](1))
        expect(hookresult.current[0]).toEqual(1)

        act(() => hookresult.current[1](100))
        expect(hookresult.current[0]).toEqual(100)

        act(() => hookresult.current[1](null))
        expect(hookresult.current[0]).toEqual(null)
    })

    it("should not accept levels below 1 or above 100", () => {
        const hookresult = render()

        expect(hookresult.current[0]).toEqual(5)

        act(() => hookresult.current[1](0))
        expect(hookresult.current[0]).toEqual(5)

        act(() => hookresult.current[1](101))
        expect(hookresult.current[0]).toEqual(5)
    })
})