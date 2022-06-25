import {EventRegistry} from "../../../data/events/events.model";
import {Pokedex} from "../../../data/pokedex/pokedex.model";
import List from "@mui/material/List";
import {EventLogEntry} from "./EventLogEntry";
import {Divider} from "@mui/material";
import {GameLocationRegistry} from "../../../data/games/games.model";
import {Team} from "../../../data/team/team.model";

export interface EventLogProps {
    eventRegistry: EventRegistry | undefined
    pokedex: Pokedex | undefined
    locationRegistry: GameLocationRegistry | undefined
    team: Team | undefined
}

export function EventLog(props: EventLogProps) {

    const {eventRegistry, pokedex, locationRegistry, team} = props

    if (pokedex === undefined || locationRegistry === undefined || team === undefined || eventRegistry === undefined) {
        return <></>
    }

    return (
        <List sx={{width: "100%", bgcolor: 'background.paper'}}>
            {eventRegistry.getAllEvents().map(event =>
                <>
                    <EventLogEntry
                        eventRegistry={eventRegistry}
                        event={event}
                        pokedex={pokedex}
                        locationRegistry={locationRegistry}
                        team={team}/>
                    <Divider variant="inset" component="li"/>
                </>
            )}
        </List>
    )
}