import {Autocomplete, Box, TextField} from "@mui/material";
import React from "react";
import {PokemonSpecies} from "../../../../data/pokedex/pokedex.model";

export interface PokemonSpeciesSelectInputProps {
    pokemonSpecies: PokemonSpecies | null
    setPokemonSpecies: (species: PokemonSpecies | null) => void
    pokemonSpeciesOptions: PokemonSpecies[]
    groupFn: (species: PokemonSpecies) => string
}

export function PokemonSpeciesSelectInput(props: PokemonSpeciesSelectInputProps) {

    const {pokemonSpecies, setPokemonSpecies, pokemonSpeciesOptions, groupFn} = props
    
    return (
        <Autocomplete
            sx={{margin: 1}}
            data-testid="pokemon-species-input"
            value={pokemonSpecies}
            options={pokemonSpeciesOptions}
            groupBy={species => groupFn(species)}
            renderOption={(p, option) => (
                <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...p}>
                    <img
                        loading="lazy"
                        width="100"
                        src={option.sprite}
                        alt={option.name}
                    />
                    {option.name}
                </Box>
            )}
            getOptionLabel={pokemon => pokemon?.name ?? ""}
            onChange={(_, newPokemon) => setPokemonSpecies(newPokemon)}
            renderInput={(params) => <TextField{...params} label="Pokemon"/>}
        />
    )
}