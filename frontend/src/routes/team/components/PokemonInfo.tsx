import {PokemonInfoViewModel} from "../hooks/vm/PokemonInfo.vm";
import {Box, Dialog, DialogTitle, Grid, ListItem, ListItemText} from "@mui/material";
import {SubmitCancelDialogActions} from "../../eventAdder/components/common/SubmitCancelDialogActions";
import React from "react";
import List from "@mui/material/List";

export function PokemonInfo(props: PokemonInfoViewModel) {
    const {state, interactions} = props

    return (
        <Dialog open={state.open} onClose={interactions.closeDialog} fullWidth>
            <Grid container direction="column" alignItems="center">
                <Grid item>
                    <DialogTitle data-testid="pokemon-info-title">{state.nickname}</DialogTitle>
                </Grid>
                <Grid item>
                    <Box
                        component="img"
                        sx={{
                            height: 200,
                            width: 200,
                        }}
                        alt="The house from the offer."
                        src={state.species.sprite}
                    />
                </Grid>
                <Grid item>
                    <List>
                        <ListItem><ListItemText primary={`Level: ${state.level}`}/></ListItem>
                        <ListItem><ListItemText primary={`Nature: ${state.nature}`}/></ListItem>
                        <ListItem><ListItemText primary={`Gender: ${state.gender}`}/></ListItem>
                    </List>
                </Grid>
                <SubmitCancelDialogActions closeDialog={interactions.closeDialog} submit={interactions.submit}/>
            </Grid>
        </Dialog>
    )
}