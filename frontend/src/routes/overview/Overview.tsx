import {useQuery} from "react-query";
import {performLoadingCheck} from "../../util/loading";
import {loadRules} from "../../api/rules/rulesApi";
import {NuzlockeRun} from "../../api/runs/runsTypes";

export interface OverviewProps {
    run: NuzlockeRun | null
}

export default function Overview(props: OverviewProps) {

    const rulesData = useQuery("/rules", loadRules)

    if (props.run === null) {
        return <h1>No Run Selected</h1>
    }

    const loadCheck = performLoadingCheck([rulesData])
    if (loadCheck !== null) {
        return loadCheck
    }

    return (
        <>
            <h1>Overview</h1>
            <ul>
                {props.run.rules.map(x => <li key={x}>{rulesData.data!.rules.get(x)}</li>)}
            </ul>
            <br/>
            <ul>
                {props.run.customRules.map(x => <li key={x}>{x}</li>)}
            </ul>
        </>
    )
}