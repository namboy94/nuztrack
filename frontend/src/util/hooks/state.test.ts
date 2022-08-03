import {act, renderHook} from "@testing-library/react";
import {useResetState} from "./state";

describe("state hooks", () => {
    it("should create a resetable state", () => {
        const result = renderHook(() => useResetState("Test")).result
        const [value, setter, reset] = result.current
        expect(value).toEqual("Test")

        act(() => setter("New"))
        expect(result.current[0]).toEqual("New")

        act(reset)
        expect(result.current[0]).toEqual("Test")
    })
})