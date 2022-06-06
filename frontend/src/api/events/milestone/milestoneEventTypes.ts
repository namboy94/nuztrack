import {Event} from "../eventTypes"

export type MilestoneEvent = {
    event: Event,
    milestone: string,
}

export type CreateMilestoneEvent = {
    location: string,
    milestone: string
}