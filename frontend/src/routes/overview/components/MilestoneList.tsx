import {Milestone} from "../../../data/games/games.model";
import {MilestoneEvent} from "../../../data/events/events.model";
import {Avatar, Badge, Grid, Tooltip, Typography} from "@mui/material";

export interface MilestoneListProps {
    milestones: Milestone[]
    userMilestones: MilestoneEvent[]
    addMilestone: (milestone: Milestone) => void
}

export function MilestoneList(props: MilestoneListProps) {
    const {milestones, userMilestones, addMilestone} = props
    const achievedMilestones = userMilestones.map(event => event.milestone)

    return <Grid container spacing={2}>
        {milestones.map(milestone =>
            <Grid item spacing={2} style={{textAlign: "right"}}>
                <Tooltip title={<>
                    <Typography variant="subtitle1">{milestone.name}</Typography>
                    <Typography variant="subtitle2">Level Cap: {milestone.level_cap}</Typography>
                </>}>
                    <Avatar
                        src={milestone.image}
                        onClick={() => addMilestone(milestone)}
                        style={{
                            height: "35px",
                            width: "35px",
                            filter: `grayscale(${achievedMilestones.includes(milestone.name) ? 0 : 100}%)`
                        }}
                    />
                </Tooltip>
                <Badge badgeContent={milestone.level_cap} color="primary" style={{marginTop: -15}}/>
            </Grid>
        )}
    </Grid>
}