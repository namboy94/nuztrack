import {EvolutionEvent} from "../../../data/events/events.model";
import {Pokedex} from "../../../data/pokedex/pokedex.model";
import {Avatar, ListItem, ListItemText} from "@mui/material";
import {Team} from "../../../data/team/team.model";

export interface EvolutionLogEntryProps {
    event: EvolutionEvent
    pokedex: Pokedex
    team: Team
}

export function EvolutionLogEntry(props: EvolutionLogEntryProps) {

    const {event, pokedex, team} = props

    const member = team.getTeamMemberById(event.teamMemberId)!!
    const newSpecies = pokedex.getSpecies(event.newPokedexNumber)!!

    let title = `${member.nickname} evolved into a ${newSpecies.name} at level ${event.level}`
    const subtitle = `${event.location}, ${event.timestamp.toString()}`

    return (
        <ListItem>
            <Avatar alt={newSpecies.name} src={newSpecies.sprite} sx={{
                width: 70,
                height: 70,
                marginRight: 3,
                backgroundColor: "#f8bdff"
            }}/>
            <ListItemText primary={title} secondary={subtitle}/>
        </ListItem>
    )
}