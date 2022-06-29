import {Pokedex} from "../../../data/pokedex/pokedex.model";
import {TeamMember, TeamState} from "../../../data/team/team.model";
import {Button, Card, CardActions, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InfoIcon from '@mui/icons-material/Info';
import {getSpriteUrl} from "../../../util/sprites";
import {NuzlockeRun} from "../../../data/runs/runs.model";

export interface TeamMemberGridProps {
    run: NuzlockeRun
    pokedex: Pokedex | undefined
    teamMembers: TeamMember[]
    state: TeamState
    movePokemon: (teamMember: TeamMember) => void
    showDetails: (teamMember: TeamMember) => void
}

export function TeamMemberGrid(props: TeamMemberGridProps) {
    const {pokedex, teamMembers, state, movePokemon, showDetails, run} = props

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
                        image={getSpriteUrl(pokedex.getSpecies(teamMember.pokedexNumber)!!.name, run.game, false)}
                        component="img"
                        height="120"
                        alt={teamMember.nickname}
                    />
                    <CardActions style={{justifyContent: "center"}}>
                        {state != TeamState.DEAD ?
                            <Button onClick={() => movePokemon(teamMember)}>
                                {state === TeamState.ACTIVE ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>}
                            </Button> : <></>}
                        <Button onClick={() => console.log("info")}><InfoIcon/></Button>
                    </CardActions>
                </Card>
            </Paper>
        </Grid>)}
    </Grid>

}