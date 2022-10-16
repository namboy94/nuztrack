import {TeamMember, TeamState} from "../../../data/team/team.model";
import {Button, Card, CardActions, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InfoIcon from '@mui/icons-material/Info';
import {getSpriteUrl} from "../../../util/sprites";
import {Pokedex} from "../../../data/pokedex/pokedex.model";
import {Game} from "../../../data/games/games.model";

export interface PokemonGridItemProps {
    teamMember: TeamMember,
    pokedex: Pokedex,
    game: Game,
    teamState: TeamState,
    openTeamMemberSwitchDialog: () => void,
    openInfoPage: () => void
}

export function PokemonGridItem(props: PokemonGridItemProps) {

    const {teamMember, pokedex, game, teamState, openTeamMemberSwitchDialog, openInfoPage} = props

    return (
        <Grid item data-testid="pokemon-card" key={teamMember.id}>
            <Paper>
                <Card>
                    <CardContent>
                        <Typography textAlign="center" data-testid="pokemon-title">
                            {teamMember.nickname}
                        </Typography>
                    </CardContent>
                    <CardMedia
                        data-testid="pokemon-card-image"
                        onClick={openInfoPage}
                        style={{backgroundColor: "#DDDDDD", borderRadius: "15px"}}
                        image={getSpriteUrl(pokedex.getSpecies(teamMember.pokedexNumber)!!.name, game, false)}
                        component="img"
                        height="120"
                        alt={teamMember.nickname}
                    />
                    <CardActions style={{justifyContent: "center"}}>
                        {teamState !== TeamState.DEAD ?
                            <Button data-testid="team-member-switch-button" onClick={openTeamMemberSwitchDialog}>
                                {teamState === TeamState.ACTIVE ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>}
                            </Button> : <></>}
                        <Button data-testid="info-button" onClick={openInfoPage}><InfoIcon/></Button>
                    </CardActions>
                </Card>
            </Paper>
        </Grid>
    )
}