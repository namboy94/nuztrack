import {Autocomplete, TextField} from "@mui/material";
import React from "react";

export interface LocationInputProps {
    locations: string[]
    location: string,
    setLocation: (location: string) => void
}

export function LocationInput(props: LocationInputProps) {

    const {location, locations, setLocation} = props

    return (
        <Autocomplete
            sx={{margin: 1}}
            data-testid="location-input"
            freeSolo
            options={locations}
            onChange={(_, newLocation) => setLocation(newLocation ?? "")}
            value={location}
            renderInput={(params) => <TextField{...params} label="Location"/>}
        />
    )
}