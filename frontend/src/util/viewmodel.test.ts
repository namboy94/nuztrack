import {getInteractions, getState, ViewModel} from "./viewmodel";
import {renderHook} from "@testing-library/react";

describe("ViewModel", () => {

    type TestViewModel = ViewModel<string, string>

    function useDummy(): TestViewModel {
        return {state: "State", interactions: "Interactions"}
    }

    it("should get states and interactions from ViewModel", () => {
        const result = renderHook(() => useDummy()).result
        expect(getState(result)).toEqual("State")
        expect(getInteractions(result)).toEqual("Interactions")
    })
})