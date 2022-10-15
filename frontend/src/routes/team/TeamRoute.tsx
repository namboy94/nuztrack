import {RunRouteProps} from "../common/RouteProps";
import {useTeamDataLoader} from "./hooks/Team.data.hooks";
import {Divider, Typography} from "@mui/material";
import {PokemonGrid} from "./components/PokemonGrid";
import {usePokemonGridViewModel} from "./hooks/vm/PokemonGrid.vm";
import {TeamState} from "../../data/team/team.model";
import {LoadingIndicator} from "../common/components/LoadingIndicator";

export function TeamRoute(props: RunRouteProps) {
    const {run, notify} = props
    const loading = useTeamDataLoader(run)
    const activePokemonGridProps = usePokemonGridViewModel(run, notify, TeamState.ACTIVE)
    const boxedPokemonGridProps = usePokemonGridViewModel(run, notify, TeamState.BOXED)
    const deadPokemonGridProps = usePokemonGridViewModel(run, notify, TeamState.DEAD)

    if (loading) {
        return <LoadingIndicator/>
    }

    return <>
        <Typography variant="h5">Team</Typography>
        <Divider/>
        <Typography variant="subtitle1">Active</Typography>
        <PokemonGrid {...activePokemonGridProps}/>
        <Divider/>
        <Typography variant="subtitle1">Boxed</Typography>
        <PokemonGrid {...boxedPokemonGridProps}/>
        <Divider/>
        <Typography variant="subtitle1">Dead</Typography>
        <PokemonGrid {...deadPokemonGridProps}/>
    </>
}