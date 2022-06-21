import {DeathEvent} from "../../../data/events/events.model";
import {Pokedex} from "../../../data/pokedex/pokedex.model";
import {Avatar, ListItem, ListItemText} from "@mui/material";
import {Team} from "../../../data/team/team.model";

export interface DeathLogEntryProps {
    event: DeathEvent
    pokedex: Pokedex
    team: Team
}

export function DeathLogEntry(props: DeathLogEntryProps) {

    const {event, pokedex, team} = props

    const member = team.getTeamMemberById(event.teamMemberId)!!
    const species = pokedex.getSpecies(member.pokedexNumber)!!

    let title =
        `${member.nickname} died fighting against ${event.opponent} at level ${event.level}: ${event.description}`
    const subtitle = `${event.location}, ${event.timestamp.toString()}`

    return (
        <ListItem>
            <Avatar alt={species.name} src={species.sprite}
                    sx={{
                        width: 70,
                        height: 70,
                        marginRight: 3,
                        backgroundColor: "#ff645e"
                    }}/>
            <ListItemText primary={title} secondary={subtitle}/>
        </ListItem>
    )
}