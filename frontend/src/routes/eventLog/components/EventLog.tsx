import List from "@mui/material/List";
import {EventLogEntry} from "./entries/EventLogEntry";
import {Divider} from "@mui/material";
import {EventLogViewModel} from "../hooks/vm/EventLog.vm";

export function EventLog(props: EventLogViewModel) {

    const {state} = props

    return (
        <List
            data-testid="event-log-list"
            sx={{width: "100%", bgcolor: 'background.paper'}}
        >
            {state.eventRegistry.getAllEvents().map(event =>
                <div key={event.id}>
                    <EventLogEntry
                        eventRegistry={state.eventRegistry}
                        event={event}
                        pokedex={state.pokedex}
                        locationRegistry={state.locationRegistry}
                        team={state.team}/>
                    <Divider variant="inset" component="li"/>
                </div>
            )}
        </List>
    )
}