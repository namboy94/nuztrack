import {useState} from "react";

export function useLevelInput(initial: number | null): [number | null, (newLevel: number | null) => void] {
    const [level, setLevel] = useState(initial)

    const changeLevel = (newLevel: number | null) => {
        if (newLevel === null || (newLevel >= 1 && newLevel <= 100)) {
            setLevel(newLevel)
        }
    }
    return [level, changeLevel]
}
