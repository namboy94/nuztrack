import {Autocomplete, TextField} from "@mui/material";
import React from "react";
import {Game} from "../../../data/games/games.model";

export interface GameInputProps {
    onChange: (newGame: Game) => void
    game: Game
    allGames: Game[]
}

export function GameInput(props: GameInputProps) {
    return <Autocomplete
        isOptionEqualToValue={(option, value) => option.key === value.key}
        data-testid="game-input"
        sx={{width: 200}}
        options={props.allGames}
        value={props.game}
        disableClearable
        getOptionLabel={game => game.title}
        onChange={(_, newGame) => props.onChange(newGame)}
        renderInput={(params) =>
            <TextField label="Game" margin="dense" variant={"outlined"} {...params}/>}
    />
}