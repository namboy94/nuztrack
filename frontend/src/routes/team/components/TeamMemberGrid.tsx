import {Pokedex} from "../../../data/pokedex/pokedex.model";
import {TeamMember, TeamState} from "../../../data/team/team.model";
import {Button, Card, CardActions, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export interface TeamMemberGridProps {
    pokedex: Pokedex | undefined
    teamMembers: TeamMember[]
    state: TeamState
    movePokemon: (teamMember: TeamMember) => void
    showDetails: (teamMember: TeamMember) => void
}

export function TeamMemberGrid(props: TeamMemberGridProps) {
    const {pokedex, teamMembers, state, movePokemon, showDetails} = props

    if (pokedex === undefined) {
        return null
    }

    return <Grid container>
        {teamMembers.map(teamMember => <Grid item>
            <Paper>
                <Card>
                    <CardContent>
                        <Typography textAlign="center">{teamMember.nickname}</Typography>
                    </CardContent>
                    <CardMedia
                        onClick={() => showDetails(teamMember)}
                        style={{backgroundColor: "#DDDDDD", borderRadius: "15px"}}
                        image={pokedex.getSpecies(teamMember.pokedexNumber)!!.sprite}
                        component="img"
                        height="120"
                        alt={teamMember.nickname}
                    />
                    {state != TeamState.DEAD ?
                        <CardActions>
                            <Button onClick={() => movePokemon(teamMember)}>
                                {state === TeamState.ACTIVE ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>}
                            </Button>
                            <Button onClick={() => movePokemon(teamMember)}>
                                {state === TeamState.ACTIVE ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>}
                            </Button>
                        </CardActions>
                        : <></>}
                </Card>
            </Paper>
        </Grid>)}
    </Grid>

}