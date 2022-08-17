import {Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@mui/material";
import React from "react";
import {CreateNewRunDialogViewModel} from "../hooks/CreateNewRunDialog.vm";
import {RunNameInput} from "../../common/inputs/RunNameInput";
import {GameInput} from "../../common/inputs/GameInput";
import {MultiCheckboxInput} from "../../common/inputs/MultiCheckboxInput";
import {FreeformListInput} from "../../common/inputs/FreeformListInput";
import {CancelButton, SubmitButton} from "../../common/inputs/Button";

export function CreateNewRunDialog(props: CreateNewRunDialogViewModel) {

    const {interactions, state} = props

    if (state.loading) {
        return <></>
    }

    return (
        <Dialog open={state.open} onClose={interactions.onClose}>
            <DialogTitle>Create Run</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item>
                        <RunNameInput onChange={interactions.onChangeName} name={state.name}/>
                    </Grid>
                    <Grid item>
                        <GameInput game={state.game} allGames={state.allGames} onChange={interactions.onChangeGame}/>
                    </Grid>
                </Grid>
                <MultiCheckboxInput toggleOption={interactions.toggleRule} options={state.rulesOptions}
                                    selected={state.rules} label="rules"/>
                <FreeformListInput label="Custom Rules" onChange={interactions.onChangeCustomRules}
                                   currentList={state.customRules}/>
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={interactions.onClose}/>
                <SubmitButton onClick={interactions.submit}/>
            </DialogActions>
        </Dialog>
    )
}