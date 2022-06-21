import {NoteEvent} from "../../../data/events/events.model";
import {ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

export interface NoteLogEntryProps {
    event: NoteEvent
}

export function NoteLogEntry(props: NoteLogEntryProps) {

    const {event} = props

    const title = event.text
    const subtitle = `${event.location}, ${event.timestamp.toString()}`

    return (
        <ListItem>
            <ListItemAvatar sx={{
                backgroundColor: "#b0e1ff",
                height: 70,
                width: 70,
                borderRadius: 25,
                marginRight: 3
            }}>
                <LibraryBooksIcon sx={{
                    width: 80,
                    height: 40,
                    marginTop: 1.8,
                    marginLeft: -0.8,
                }}/>
            </ListItemAvatar>
            <ListItemText primary={title} secondary={subtitle}/>
        </ListItem>
    )
}