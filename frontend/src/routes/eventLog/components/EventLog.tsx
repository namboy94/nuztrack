import {Event, EventType} from "../../../data/events/events.model";

export interface EventLogProps {
    events: Event[]
}

export function EventLog(props: EventLogProps) {
    return (
        <ul>
            {props.events.map(
                item => <li>{`${EventType[item.type]} ${item.timestamp} ${item.location}`}</li>
            )}
        </ul>
    )
}