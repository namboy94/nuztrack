import {useEffect, useState} from "react";
import {runsService} from "../../../data/runs/runs.service";
import {NuzlockeRun} from "../../../data/runs/runs.model";

export function useRunSelectorRouteViewModel(): [boolean, NuzlockeRun[]] {
    const [loading, setLoading] = useState(true)
    const [runs, setRuns] = useState<NuzlockeRun[]>([])

    console.log("LESSGO")

    useEffect(() => {
        runsService.loadRuns$().subscribe({
            complete: () => {
                console.log("COMPLETE")
                setLoading(false)
            }
        })
    }, [])

    useEffect(() => {
        runsService.getRuns$().subscribe({
            next: x => {
                setRuns(x)
            }
        })
    }, [loading])

    return [loading, runs]
}