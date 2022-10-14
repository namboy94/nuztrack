import {Checkbox, Collapse, Dialog, DialogTitle, FormControlLabel, FormGroup, Grid} from "@mui/material";
import React from "react";
import {LocationInput} from "./common/LocationInput";
import {PokemonSpeciesSelectInput} from "./common/PokemonSpeciesSelectInput";
import {EncounterEventDialogViewModel} from "../hooks/vm/EncounterEventDialog.vm";
import {LevelInput} from "./common/LevelInput";
import {NicknameInput} from "./common/NicknameInput";
import {NatureInput} from "./common/NatureInput";
import {AbilitySlotInput} from "./common/AbilitySlotInput";
import {GenderInput} from "./common/GenderInput";
import {SubmitCancelDialogActions} from "./common/SubmitCancelDialogActions";

export function EncounterEventDialog(viewModel: EncounterEventDialogViewModel) {

    const {state, interactions} = viewModel

    return (<Dialog open={state.open} onClose={interactions.closeDialog}>
        <DialogTitle>Add Encounter Event</DialogTitle>
        <Grid container direction="column">
            <LocationInput location={state.location}
                           setLocation={interactions.onChangeLocation}
                           locations={state.locations}/>
            <PokemonSpeciesSelectInput
                pokemonSpecies={state.pokemonSpecies}
                setPokemonSpecies={interactions.onChangePokemonSpecies}
                pokemonSpeciesOptions={[
                    ...state.pokedex.getAllSpecies().filter(x => state.possibleEncounters.includes(x)),
                    ...state.pokedex.getAllSpecies().filter(x => !state.possibleEncounters.includes(x))
                ]}
                groupFn={
                    species => state.possibleEncounters.includes(species) ? state.location : "All"
                }
            />
            <Grid container spacing={0}>
                <Grid item>
                    <LevelInput level={state.level} setLevel={interactions.onChangeLevel}/>
                </Grid>
                <Grid item>
                    {state.run.game.generation > 1 &&
                        <GenderInput gender={state.gender} onChangeGender={interactions.onChangeGender}/>
                    }
                </Grid>
                <Grid item>
                    <FormGroup sx={{margin: 1}}>
                        <FormControlLabel control={
                            <Checkbox
                                data-testid="caught-input"
                                name="caught"
                                checked={state.caught}
                                value={state.caught}
                                onChange={x => interactions.onChangeCaught(x.target.checked)}/>
                        } label="Caught?"/>
                    </FormGroup>
                </Grid>
            </Grid>

            <Collapse in={state.caught}>
                <hr/>
                <NicknameInput nickname={state.nickname} onChangeNickname={interactions.onChangeNickname}/>
                {state.run.game.generation > 2 &&
                    <Grid container>
                        <Grid item>
                            <NatureInput nature={state.nature} onChangeNature={interactions.onChangeNature}/>
                        </Grid>
                        <Grid>
                            <AbilitySlotInput
                                abilitySlot={state.abilitySlot}
                                onChangeAbilitySlot={interactions.onChangeAbilitySlot}
                                possibleAbilitySlots={state.possibleAbilitySlots}
                                pokedex={state.pokedex}
                                pokedexNumber={state.pokemonSpecies?.pokedexNumber ?? -1}/>
                        </Grid>
                    </Grid>
                }
            </Collapse>
            <SubmitCancelDialogActions closeDialog={interactions.closeDialog} submit={interactions.submit}/>
        </Grid>
    </Dialog>)
}