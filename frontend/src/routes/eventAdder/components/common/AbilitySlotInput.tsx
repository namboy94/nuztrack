import {Autocomplete, TextField} from "@mui/material";
import React from "react";
import {Pokedex} from "../../../../data/pokedex/pokedex.model";

export interface AbilitySlotInputProps {
    abilitySlot: number,
    onChangeAbilitySlot: (newAbilitySlot: number) => void,
    possibleAbilitySlots: number[],
    pokedex: Pokedex,
    pokedexNumber: number
}

export function AbilitySlotInput(props: AbilitySlotInputProps) {
    return (<Autocomplete
        sx={{margin: 1, width: 160}}
        data-testid="ability-slot-input"
        disableClearable
        value={props.abilitySlot}
        options={props.possibleAbilitySlots}
        getOptionLabel={abilitySlot =>
            props.pokedex.getAbilityName(props.pokedexNumber, abilitySlot)
        }
        onChange={(_, newSlot) => props.onChangeAbilitySlot(newSlot)}
        renderInput={(params) =>
            <TextField{...params} label="Ability"/>
        }
    />)
}