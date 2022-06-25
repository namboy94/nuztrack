import {MilestoneEvent} from "../../../data/events/events.model";
import {Avatar, ListItem, ListItemText} from "@mui/material";
import {GameLocationRegistry} from "../../../data/games/games.model";

export interface MilestoneLogEntryProps {
    event: MilestoneEvent
    locationRegistry: GameLocationRegistry
}

export function MilestoneLogEntry(props: MilestoneLogEntryProps) {

    const {event, locationRegistry} = props

    const title = `Acquired the '${event.milestone}' Milestone`
    const image = locationRegistry.getMilestoneByName(event.milestone)!!.image
    const subtitle = `${event.location}, ${event.timestamp.toString()}`

    return (
        <ListItem>
            <Avatar alt={event.milestone} src={image} sx={{
                width: 70,
                height: 70,
                marginRight: 3,
                backgroundColor: "#e1f7c8",
                padding: 2
            }}/>
            <ListItemText primary={title} secondary={subtitle}/>
        </ListItem>
    )
}