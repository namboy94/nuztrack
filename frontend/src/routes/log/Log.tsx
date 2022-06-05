import {useEventsQuery} from "../../api/events/eventQuery";
import {NuzlockeRun} from "../../api/runs/runsTypes";
import {performLoadingCheck} from "../../util/loading";

export interface LogProps {
    run: NuzlockeRun
}

export default function Log(props: LogProps) {

    const eventsQuery = useEventsQuery(props.run.id)
    const loadCheck = performLoadingCheck([eventsQuery])
    if (loadCheck !== null) {
        return loadCheck
    }
    const events = eventsQuery.data!!

    return (
        <>
            <h1>Events</h1>
            <h2>Encounters</h2>
            {events.encounters.map(x => <h3 key={x.event.id}>
                    {x.event.timestamp} {x.event.location} {x.teamMemberId}
                </h3>
            )}
            <h2>Deaths</h2>
            {events.deaths.map(x => <h3 key={x.event.id}>
                    {x.event.timestamp} {x.event.location} {x.teamMemberId}
                </h3>
            )}
            <h2>Evolutions</h2>
            {events.evolutions.map(x => <h3 key={x.event.id}>
                    {x.event.timestamp} {x.event.location} {x.teamMemberId}
                </h3>
            )}
            <h2>Team Switches</h2>
            {events.teamMemberSwitches.map(x => <h3 key={x.event.id}>
                    {x.event.timestamp} {x.event.location} {x.teamMemberId}
                </h3>
            )}
            <h2>Notes</h2>
            {events.notes.map(x => <h3 key={x.event.id}>
                    {x.event.timestamp} {x.event.location} {x.text}
                </h3>
            )}
            <h2>Milestones</h2>
            {events.milestones.map(x => <h3 key={x.event.id}>
                    {x.event.timestamp} {x.event.location} {x.milestone}
                </h3>
            )}
        </>
    )
}