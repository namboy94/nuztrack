import * as React from "react";
import {performLoadingCheck} from "../../util/loading";
import {NuzlockeRunTO} from "../../api/runs/runsTransfer";
import {useRunsQuery} from "../../api/runs/runsQuery";
import {useRulesQuery} from "../../api/rules/rulesQuery";
import {RunSelector} from "./RunSelector";
import {useGamesQuery} from "../../api/games/gamesQuery";
import {Severity} from "../../components/Snackbar";

export interface RunSelectorRouteProps {
    setRunId: (id: number) => void
    run: NuzlockeRunTO | undefined
    displaySnack: (message: string, severity: Severity) => void
}

export function RunSelectorRoute(props: RunSelectorRouteProps) {

    const runData = useRunsQuery()
    const rulesData = useRulesQuery()
    const gamesData = useGamesQuery()
    const loadCheck = performLoadingCheck([runData, rulesData, gamesData])
    if (loadCheck !== null) {
        return loadCheck
    }

    return (
        <RunSelector
            setRunId={props.setRunId}
            run={props.run}
            displaySnack={props.displaySnack}
            runs={runData.data!!}
            rules={rulesData.data!!}
            games={gamesData.data!!}
        />
    )
}
