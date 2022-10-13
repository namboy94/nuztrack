import {act, renderHook} from "@testing-library/react";
import {useNicknameInput} from "./nicknameInput.hook";

describe("useNicknameInput", () => {

    it("should enter valid nicknames for generations 1-5", () => {
        const hookresult = renderHook(() => useNicknameInput(5)).result

        act(() => hookresult.current[1](""))
        expect(hookresult.current[0]).toEqual("")

        act(() => hookresult.current[1]("123"))
        expect(hookresult.current[0]).toEqual("123")

        act(() => hookresult.current[1]("1234567890"))
        expect(hookresult.current[0]).toEqual("1234567890")

        act(() => hookresult.current[1]("12345678901"))
        expect(hookresult.current[0]).toEqual("1234567890")
    })
    it("should enter valid nicknames for generations 6+", () => {
        const hookresult = renderHook(() => useNicknameInput(6)).result

        act(() => hookresult.current[1](""))
        expect(hookresult.current[0]).toEqual("")

        act(() => hookresult.current[1]("123"))
        expect(hookresult.current[0]).toEqual("123")

        act(() => hookresult.current[1]("123456789012"))
        expect(hookresult.current[0]).toEqual("123456789012")

        act(() => hookresult.current[1]("1234567890123"))
        expect(hookresult.current[0]).toEqual("123456789012")
    })
})