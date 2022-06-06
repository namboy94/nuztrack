import axios from "axios";
import {CreateMilestoneEvent, MilestoneEvent} from "./milestoneEventTypes";

export function createMilestoneEvent(runId: number, creator: CreateMilestoneEvent): Promise<MilestoneEvent> {
    return axios.post(`/api/events/${runId}/milestones`, creator).then(x => x.data)
}