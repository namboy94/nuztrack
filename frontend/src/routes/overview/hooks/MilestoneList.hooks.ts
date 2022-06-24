import {NuzlockeRun} from "../../../data/runs/runs.model";
import {NotificationFN} from "../../../global/Snackbar";
import {useQuery} from "../../../util/observable.hooks"
import {gamesService} from "../../../data/games/games.service";
import {eventsService} from "../../../data/events/events.service";
import {MilestoneListProps} from "../components/MilestoneList";
import {Milestone} from "../../../data/games/games.model";

export function useMilestoneListProps(run: NuzlockeRun, notify: NotificationFN): MilestoneListProps {
    const locationRegistry =
        useQuery(() => gamesService.getGameLocationRegistry$(run.game), undefined, [])
    const milestones = locationRegistry?.getMilestones() ?? []
    milestones.sort((a, b) => a.level_cap < b.level_cap ? -1 : 1)
    const userMilestones = useQuery(() => eventsService.getMilestoneEvents$(run.id), [], [])

    const addMilestone = (milestone: Milestone) => {
        const creator = {milestone: milestone.name, location: milestone.location}
        eventsService.createMilestoneEvent$(run.id, creator).subscribe({
            complete: () => notify("Successfully added milestone", "success"),
            error: e => notify(`Failed to add milestone: ${e.response.data.reason}`, "error")
        })
    }

    return {
        milestones: milestones,
        userMilestones: userMilestones,
        addMilestone: addMilestone
    }
}
