import {useQuery} from "react-query";
import {loadRun} from "../api/runs/runsApi";
import {performLoadingCheck} from "../util/loading";
import {loadRules} from "../api/rules/rulesApi";

export interface OverviewProps {
    runId: number
}

export default function Overview(props: OverviewProps) {

    const runData = useQuery(`/runs/${props.runId}`, () => loadRun(props.runId))
    const rulesData = useQuery("/rules", loadRules)
    const loadCheck = performLoadingCheck([runData, rulesData])
    if (loadCheck !== null) {
        return loadCheck
    }

    return (
        <>
            <h1>Overview</h1>
            <ul>
                {runData.data!.rules.map(x => <li key={x}>{rulesData.data!.rules.get(x)}</li>)}
            </ul>
        </>
    )
}