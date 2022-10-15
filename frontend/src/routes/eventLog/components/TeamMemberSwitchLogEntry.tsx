import {EventRegistry, EvolutionEvent, SwitchType, TeamMemberSwitchEvent} from "../../../data/events/events.model";
import {Pokedex} from "../../../data/pokedex/pokedex.model";
import {Avatar, ListItem, ListItemText} from "@mui/material";
import {Team} from "../../../data/team/team.model";

export interface TeamMemberSwitchLogEntryProps {
    eventRegistry: EventRegistry
    event: TeamMemberSwitchEvent
    pokedex: Pokedex
    team: Team
}

export function TeamMemberSwitchLogEntry(props: TeamMemberSwitchLogEntryProps) {

    const {event, pokedex, team, eventRegistry} = props

    const member = team.getTeamMemberById(event.teamMemberId)!!
    const evolutions = member.evolutionIds
        .map(evolutionId => eventRegistry.getEventById(evolutionId)!! as EvolutionEvent)
        .filter(evolution => evolution.timestamp > event.timestamp)
        .map(evolution => evolution.previousPokedexNumber)

    const pokedexNumber = evolutions.length === 0 ? member.pokedexNumber : evolutions[0]
    const species = pokedex.getSpecies(pokedexNumber)!!

    const title = event.switchType === SwitchType.ADD
        ? `Added ${member.nickname} to the active party`
        : `Removed ${member.nickname} from the active party`

    const subtitle = `${event.location}, ${event.timestamp.toString()}`
    const iconColor = event.switchType === SwitchType.ADD ? "#ebffb5" : "#eaeff1"

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