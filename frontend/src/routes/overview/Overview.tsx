import {performLoadingCheck} from "../../util/loading";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import {useRulesQuery} from "../../api/rules/rulesQuery";

export interface OverviewProps {
    run: NuzlockeRun
}

export default function Overview(props: OverviewProps) {

    const rulesData = useRulesQuery()
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