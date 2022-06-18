import {useState} from "react";

export function useResetState<T>(initial: T): [T, (value: T) => void, () => void] {
    const [value, setter] = useState<T>(initial)
    return [value, setter, () => setter(initial)]
}