import {TeamMember, TeamState} from "../../../data/team/team.model";
import {Button, Card, CardActions, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InfoIcon from '@mui/icons-material/Info';

export interface PokemonGridItemProps {
    teamMember: TeamMember,
    teamState: TeamState,
    openTeamMemberSwitchDialog: () => void,
    openInfoPage: () => void
}

export function PokemonGridItem(props: PokemonGridItemProps) {

    const {teamMember, teamState, openTeamMemberSwitchDialog, openInfoPage} = props

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
                        image={teamMember.sprite}
                        component="img"
                        height="120"
                        alt={teamMember.nickname}
                    />
                    <CardActions style={{justifyContent: "center"}}>
                        {teamState !== TeamState.DEAD ?
                            <Button data-testid="team-member-switch-button" onClick={openTeamMemberSwitchDialog}>
                                {teamState === TeamState.ACTIVE ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>}
                            </Button> : <></>}
                        <Button data-testid="pokemon-info-button" onClick={openInfoPage}><InfoIcon/></Button>
                    </CardActions>
                </Card>
            </Paper>
        </Grid>
    )
}