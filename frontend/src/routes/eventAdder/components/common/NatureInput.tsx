import {Autocomplete, TextField} from "@mui/material";
import React from "react";
import {useQuery} from "../../../../util/hooks/observable";
import {pokedexService} from "../../../../data/pokedex/pokedex.service";

export interface NatureInputProps {
    nature: string,
    onChangeNature: (newNature: string) => void
}

export function NatureInput(props: NatureInputProps) {
    const natures = useQuery(() => pokedexService.getNatures$(), [], []) ?? []
    return (<Autocomplete
        sx={{margin: 1, width: 140}}
        data-testid="nature-input"
        disableClearable
        value={props.nature}
        options={natures}
        onChange={(_, newNature) => props.onChangeNature(newNature)}
        renderInput={(params) =>
            <TextField{...params} label="Nature"/>
        }
        // renderOption={(_, option) => option.charAt(0) + option.toLowerCase().substring(1)}
    />)
}