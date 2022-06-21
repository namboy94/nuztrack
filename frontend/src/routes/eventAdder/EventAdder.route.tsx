import {RunRouteProps} from "../common/RouteProps";
import {useEventAdderDataLoader} from "./hooks/EventAdder.data.hook";
import {useEncounterEventDialogProps} from "./hooks/EncounterEventDialog.hooks";
import {EncounterEventDialog} from "./components/EncounterEventDialog";
import AddIcon from "@mui/icons-material/Add";
import {Button} from "@mui/material";
import * as React from "react";
import {useNoteEventDialogProps} from "./hooks/NoteEventDialog.hooks";
import {NoteEventDialog} from "./components/NoteEventDialog";
import {useEvolutionEventDialogProps} from "./hooks/EvolutionEventDialog.hooks";
import {EvolutionEventDialog} from "./components/EvolutionEventDialog";
import {DeathEventDialog} from "./components/DeathEventDialog";
import {useDeathEventDialogProps} from "./hooks/DeathEventDialog.hooks";
import {useMilestoneEventDialogProps} from "./hooks/MilestoneEventDialog.hooks";
import {MilestoneEventDialog} from "./components/MilestoneEventDialog";
import {useTeamMemberSwitchEventDialogProps} from "./hooks/TeamMemberSwitchEventDialog.hooks";
import {SwitchType} from "../../data/events/events.model";
import {TeamMemberSwitchEventDialog} from "./components/TeamMemberSwitchEventDialog";

export function EventAdderRoute(props: RunRouteProps) {

    const loading = useEventAdderDataLoader(props.run)
    const [openEncounterEventDialog, encounterEventDialogProps] = useEncounterEventDialogProps(props.run, props.notify)
    const [openNoteEventDialog, noteEventDialogProps] = useNoteEventDialogProps(props.run, props.notify)
    const [openEvolutionEventDialog, evolutionEventDialogProps] = useEvolutionEventDialogProps(props.run, props.notify)
    const [openDeathEventDialog, deathEventDialogProps] = useDeathEventDialogProps(props.run, props.notify)
    const [openMilestoneEventDialog, milestoneEventDialogProps] = useMilestoneEventDialogProps(props.run, props.notify)
    const [openRemoveTeamMemberDialog, removeTeamMemberDialogProps] =
        useTeamMemberSwitchEventDialogProps(props.run, props.notify, SwitchType.REMOVE)
    const [openAddTeamMemberDialog, addTeamMemberDialogProps] =
        useTeamMemberSwitchEventDialogProps(props.run, props.notify, SwitchType.ADD)

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <>
            <Button data-testid="open-encounter-dialog-button"
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openEncounterEventDialog}>
                Encounter
            </Button>
            <Button data-testid="open-note-dialog-button"
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openNoteEventDialog}>
                Note
            </Button>
            <Button data-testid="open-evolution-dialog-button"
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openEvolutionEventDialog}>
                Evolution
            </Button>
            <Button data-testid="open-death-dialog-button"
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openDeathEventDialog}>
                Death
            </Button>
            <Button data-testid="open-milestone-dialog-button"
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openMilestoneEventDialog}>
                Death
            </Button>
            <Button data-testid="open-remove-team-member-dialog-button"
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openRemoveTeamMemberDialog}>
                Remove Team Member
            </Button>
            <Button data-testid="open-add-team-member-dialog-button"
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openAddTeamMemberDialog}>
                Add Team Member
            </Button>
            <EncounterEventDialog {...encounterEventDialogProps}/>
            <NoteEventDialog {...noteEventDialogProps}/>
            <EvolutionEventDialog {...evolutionEventDialogProps}/>
            <DeathEventDialog {...deathEventDialogProps}/>
            <MilestoneEventDialog {...milestoneEventDialogProps}/>
            <TeamMemberSwitchEventDialog {...removeTeamMemberDialogProps}/>
            <TeamMemberSwitchEventDialog {...addTeamMemberDialogProps}/>
        </>
    )
}