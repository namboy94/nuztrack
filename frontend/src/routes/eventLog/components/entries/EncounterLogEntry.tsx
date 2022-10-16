import {EncounterEvent} from "../../../../data/events/events.model";
import {Pokedex} from "../../../../data/pokedex/pokedex.model";
import {Avatar, ListItem, ListItemText} from "@mui/material";
import {Team} from "../../../../data/team/team.model";

export interface EncounterLogEntryProps {
    event: EncounterEvent
    pokedex: Pokedex
    team: Team
}

export function EncounterLogEntry(props: EncounterLogEntryProps) {

    const {event, pokedex, team} = props

    const species = pokedex.getSpecies(event.pokedexNumber)!!
    const nickname = team.getTeamMemberById(event.teamMemberId ?? -1)?.nickname ?? ""
    const verb = event.caught ? "Caught" : "Encountered";
    const nicknameText = nickname === "" ? "" : `${nickname} the `
    const title = `${verb} ${nicknameText}${species.name} in ${event.location} at level ${event.level}`
    const subtitle = `${event.location}, ${event.timestamp.toString()}`
    const iconColor = event.caught ? "#c2ffca" : "#eaeff1"
    const filter = event.caught ? "none" : "grayscale(100%)"

    return (
        <ListItem data-testid="encounter-log-entry">
            <Avatar alt={species.name} src={event.sprite} style={{filter: filter}} sx={{
                width: 70,
                height: 70,
                marginRight: 3,
                backgroundColor: iconColor
            }}/>
            <ListItemText primary={title} secondary={subtitle}/>
        </ListItem>
    )
}