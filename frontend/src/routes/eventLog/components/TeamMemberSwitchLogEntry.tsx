import {SwitchType, TeamMemberSwitchEvent} from "../../../data/events/events.model";
import {Pokedex} from "../../../data/pokedex/pokedex.model";
import {Avatar, ListItem, ListItemText} from "@mui/material";
import {Team} from "../../../data/team/team.model";

export interface TeamMemberSwitchLogEntryProps {
    event: TeamMemberSwitchEvent
    pokedex: Pokedex
    team: Team
}

export function TeamMemberSwitchLogEntry(props: TeamMemberSwitchLogEntryProps) {

    const {event, pokedex, team} = props

    const member = team.getTeamMemberById(event.teamMemberId)!!
    const species = pokedex.getSpecies(member.pokedexNumber)!!

    let title = ""
    if (event.switchType == SwitchType.ADD) {
        title = `Added ${member.nickname} to the active party`
    } else {
        title = `Removed ${member.nickname} from the active party`
    }
    const subtitle = `${event.location}, ${event.timestamp.toString()}`
    const iconColor = event.switchType == SwitchType.ADD ? "#ebffb5" : "#eaeff1"

    return (
        <ListItem>
            <Avatar alt={species.name} src={species.sprite} sx={{
                width: 70,
                height: 70,
                marginRight: 3,
                backgroundColor: iconColor
            }}/>
            <ListItemText primary={title} secondary={subtitle}/>
        </ListItem>
    )
}