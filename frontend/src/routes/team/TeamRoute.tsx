import {RunRouteProps} from "../common/RouteProps";
import {useTeamDataLoader} from "./hooks/Team.data";
import {Divider, Typography} from "@mui/material";
import {TeamMemberGrid} from "./components/TeamMemberGrid";
import {usePokemonGridProps} from "./hooks/TeamMemberGrid.hooks";
import {TeamState} from "../../data/team/team.model";

export function TeamRoute(props: RunRouteProps) {
    const {run, notify} = props
    const loading = useTeamDataLoader(run)
    const activePokemonGridProps = usePokemonGridProps(run, notify, TeamState.ACTIVE)
    const boxedPokemonGridProps = usePokemonGridProps(run, notify, TeamState.BOXED)
    const deadPokemonGridProps = usePokemonGridProps(run, notify, TeamState.DEAD)

    if (loading) {
        return <h1>Loading...</h1>
    }

    return <>
        <Typography variant="h5">Team</Typography>
        <Divider/>
        <Typography variant="subtitle1">Active</Typography>
        <TeamMemberGrid {...activePokemonGridProps}/>
        <Divider/>
        <Typography variant="subtitle1">Boxed</Typography>
        <TeamMemberGrid {...boxedPokemonGridProps}/>
        <Divider/>
        <Typography variant="subtitle1">Dead</Typography>
        <TeamMemberGrid {...deadPokemonGridProps}/>
    </>
}