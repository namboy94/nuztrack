import {Grid} from "@mui/material";
import {PokemonGridViewModel} from "../hooks/vm/PokemonGrid.vm";
import {PokemonGridItem} from "./PokemonGridItem";
import {PokemonInfo} from "./PokemonInfo";


export function PokemonGrid(props: PokemonGridViewModel) {
    const {state, interactions} = props

    return <Grid container>
        {state.teamMembers.map(teamMember =>
            <PokemonGridItem
                key={teamMember.id}
                teamMember={teamMember}
                teamState={state.teamState}
                openTeamMemberSwitchDialog={() => interactions.openTeamMemberSwitchDialog(teamMember)}
                openInfoPage={() => interactions.openInfoPage(teamMember)}
            />
        )}
        <PokemonInfo {...state.infoPageVm}/>
    </Grid>
}
