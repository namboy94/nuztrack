import {Grid} from "@mui/material";
import {PokemonGridViewModel} from "../hooks/vm/PokemonGrid.vm";
import {PokemonGridItem} from "./PokemonGridItem";


export function PokemonGrid(props: PokemonGridViewModel) {
    const {state, interactions} = props

    return <Grid container>
        {state.teamMembers.map(teamMember =>
            <PokemonGridItem
                key={teamMember.id}
                teamMember={teamMember}
                pokedex={state.pokedex}
                game={state.run.game}
                teamState={state.teamState}
                openTeamMemberSwitchDialog={() => interactions.openTeamMemberSwitchDialog(teamMember)}
                openInfoPage={() => console.log("TODO")}
            />
        )}
    </Grid>
}
