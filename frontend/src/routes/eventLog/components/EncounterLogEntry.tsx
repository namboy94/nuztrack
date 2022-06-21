import {EncounterEvent} from "../../../data/events/events.model";
import {Pokedex} from "../../../data/pokedex/pokedex.model";
import {Avatar, ListItem, ListItemText} from "@mui/material";

export interface EncounterLogEntryProps {
    event: EncounterEvent
    pokedex: Pokedex
}

export function EncounterLogEntry(props: EncounterLogEntryProps) {

    const {event, pokedex} = props

    const species = pokedex.getSpecies(event.pokedexNumber)!!
    const verb = event.caught ? "Caught" : "Encountered";
    const title = `${verb} ${species.name} in ${event.location} at level ${event.level}`
    const subtitle = `${event.location}, ${event.timestamp.toString()}`
    const iconColor = event.caught ? "#c2ffca" : "#eaeff1"
    const filter = event.caught ? "none" : "grayscale(100%)"

    return (
        <ListItem>
            <Avatar alt={species.name} src={species.sprite} style={{filter: filter}} sx={{
                width: 70,
                height: 70,
                marginRight: 3,
                backgroundColor: iconColor
            }}/>
            <ListItemText primary={title} secondary={subtitle}/>
        </ListItem>
    )
}