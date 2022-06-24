import {Milestone} from "../../../data/games/games.model";
import {MilestoneEvent} from "../../../data/events/events.model";
import {Avatar, Grid, Tooltip, Typography} from "@mui/material";

export interface MilestoneListProps {
    milestones: Milestone[]
    userMilestones: MilestoneEvent[]
    addMilestone: (milestone: Milestone) => void
}

export function MilestoneList(props: MilestoneListProps) {
    const {milestones, userMilestones, addMilestone} = props
    const achievedMilestones = userMilestones.map(event => event.milestone)

    return <Grid container spacing={1}>
        {milestones.map(milestone =>
            <Grid item>
                <Tooltip title={<>
                    <Typography variant="subtitle1">{milestone.name}</Typography>
                    <Typography variant="subtitle2">Level Cap: {milestone.level_cap}</Typography>
                </>}>
                    <Avatar
                        src={milestone.image}
                        alt={milestone.name}
                        onClick={() => addMilestone(milestone)}
                        style={{filter: `grayscale(${achievedMilestones.includes(milestone.name) ? 0 : 100}%)`}}/>
                </Tooltip>
            </Grid>
        )}
    </Grid>
}