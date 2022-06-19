import {NuzlockeRun} from "../../../data/runs/runs.model";
import {useQuery} from "../../../util/observable.hooks";
import {eventsService} from "../../../data/events/events.service";
import {EventLogProps} from "../components/EventLog";

export function useEventLogProps(run: NuzlockeRun): EventLogProps {
    const events = useQuery(() => eventsService.getEvents$(run.id), [], [])
    events.sort((a, b) => a.timestamp < b.timestamp ? -1 : 1)
    return {
        events: events
    }
}
