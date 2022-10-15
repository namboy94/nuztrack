import {TeamState} from "../../../data/team/team.model";
import {Button, Card, CardActions, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InfoIcon from '@mui/icons-material/Info';
import {getSpriteUrl} from "../../../util/sprites";
import {PokemonGridViewModel} from "../hooks/vm/PokemonGrid.vm";


export function PokemonGrid(props: PokemonGridViewModel) {
    const {state} = props

    return <Grid container>
        {state.teamMembers.map(teamMember =>
            <Grid item data-testid="team-member-card" key={teamMember.id}>
                <Paper>
                    <Card>
                        <CardContent>
                            <Typography textAlign="center">{teamMember.nickname}</Typography>
                        </CardContent>
                        <CardMedia
                            onClick={() => console.log("TODO")}
                            style={{backgroundColor: "#DDDDDD", borderRadius: "15px"}}
                            image={getSpriteUrl(state.pokedex.getSpecies(teamMember.pokedexNumber)!!.name, state.run.game, false)}
                            component="img"
                            height="120"
                            alt={teamMember.nickname}
                        />
                        <CardActions style={{justifyContent: "center"}}>
                            {state.teamState !== TeamState.DEAD ?
                                <Button onClick={() => console.log("TODO")}>
                                    {state.teamState === TeamState.ACTIVE ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>}
                                </Button> : <></>}
                            <Button onClick={() => console.log("info")}><InfoIcon/></Button>
                        </CardActions>
                    </Card>
                </Paper>
            </Grid>
        )}
    </Grid>

}