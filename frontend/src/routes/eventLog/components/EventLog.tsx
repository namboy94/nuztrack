import {Event} from "../../../data/events/events.model";
import {Pokedex} from "../../../data/pokedex/pokedex.model";
import List from "@mui/material/List";
import {EventLogEntry} from "./EventLogEntry";
import {Divider} from "@mui/material";
import {GameLocationRegistry} from "../../../data/games/games.model";
import {Team} from "../../../data/team/team.model";

export interface EventLogProps {
    events: Event[]
    pokedex: Pokedex | undefined
    locationRegistry: GameLocationRegistry | undefined
    team: Team | undefined
}

export function EventLog(props: EventLogProps) {

    const {events, pokedex, locationRegistry, team} = props

    if (pokedex === undefined || locationRegistry === undefined || team === undefined) {
        return <></>
    }

    return (
        <List sx={{width: "100%", bgcolor: 'background.paper'}}>
            {events.map(event =>
                <>
                    <EventLogEntry event={event} pokedex={pokedex} locationRegistry={locationRegistry} team={team}/>
                    <Divider variant="inset" component="li"/>
                </>
            )}
        </List>
    )
}