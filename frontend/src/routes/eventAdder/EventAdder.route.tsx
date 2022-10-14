import {RunRouteProps} from "../common/RouteProps";
import {useEventAdderDataLoader} from "./hooks/EventAdder.data.hook";
import {EncounterEventDialog} from "./components/EncounterEventDialog";
import AddIcon from "@mui/icons-material/Add";
import {Button} from "@mui/material";
import * as React from "react";
import {useNoteEventDialogProps} from "./hooks/NoteEventDialog.hooks";
import {NoteEventDialog} from "./components/NoteEventDialog";
import {useEvolutionEventDialogViewModel} from "./hooks/vm/EvolutionEventDialog.hooks";
import {EvolutionEventDialog} from "./components/EvolutionEventDialog";
import {DeathEventDialog} from "./components/DeathEventDialog";
import {useDeathEventDialogViewModel} from "./hooks/vm/DeathEventDialog.vm";
import {useMilestoneEventDialogProps} from "./hooks/MilestoneEventDialog.hooks";
import {MilestoneEventDialog} from "./components/MilestoneEventDialog";
import {useTeamMemberSwitchEventDialogProps} from "./hooks/TeamMemberSwitchEventDialog.hooks";
import {SwitchType} from "../../data/events/events.model";
import {TeamMemberSwitchEventDialog} from "./components/TeamMemberSwitchEventDialog";
import {LoadingIndicator} from "../common/components/LoadingIndicator";
import {useEncounterEventDialogViewModel} from "./hooks/vm/EncounterEventDialog.vm";

export function EventAdderRoute(props: RunRouteProps) {

    const loading = useEventAdderDataLoader(props.run)
    const encounterEventDialogViewModel = useEncounterEventDialogViewModel(props.run, props.notify)
    const [openNoteEventDialog, noteEventDialogProps] = useNoteEventDialogProps(props.run, props.notify)
    const evolutionEventDialogViewModel = useEvolutionEventDialogViewModel(props.run, props.notify)
    const deathEventDialogViewModel = useDeathEventDialogViewModel(props.run, props.notify)
    const [openMilestoneEventDialog, milestoneEventDialogProps] = useMilestoneEventDialogProps(props.run, props.notify)
    const [openRemoveTeamMemberDialog, removeTeamMemberDialogProps] =
        useTeamMemberSwitchEventDialogProps(props.run, props.notify, SwitchType.REMOVE)
    const [openAddTeamMemberDialog, addTeamMemberDialogProps] =
        useTeamMemberSwitchEventDialogProps(props.run, props.notify, SwitchType.ADD)

    if (loading) {
        return <LoadingIndicator/>
    }

    const buttonStyle = {width: "150px", height: "150px", margin: "5px"}

    return (
        <>
            <DialogOpenButton
                data-testid="open-encounter-dialog-button"
                title="Encounter"
                openFn={encounterEventDialogViewModel.interactions.openDialog}
            />
            <Button data-testid="open-note-dialog-button"
                    style={buttonStyle}
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openNoteEventDialog}>
                Note
            </Button>
            <Button data-testid="open-evolution-dialog-button"
                    style={buttonStyle}
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={evolutionEventDialogViewModel.interactions.openDialog}>
                Evolution
            </Button>
            <DialogOpenButton
                data-testid="open-death-dialog-button"
                title="Death"
                openFn={deathEventDialogViewModel.interactions.openDialog}
            />
            <Button data-testid="open-milestone-dialog-button"
                    style={buttonStyle}
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openMilestoneEventDialog}>
                Milestone
            </Button>
            <Button data-testid="open-remove-team-member-dialog-button"
                    style={buttonStyle}
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openRemoveTeamMemberDialog}>
                Remove Team Member
            </Button>
            <Button data-testid="open-add-team-member-dialog-button"
                    style={buttonStyle}
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openAddTeamMemberDialog}>
                Add Team Member
            </Button>
            <EncounterEventDialog {...encounterEventDialogViewModel}/>
            <NoteEventDialog {...noteEventDialogProps}/>
            <EvolutionEventDialog {...evolutionEventDialogViewModel}/>
            <DeathEventDialog {...deathEventDialogViewModel}/>
            <MilestoneEventDialog {...milestoneEventDialogProps}/>
            <TeamMemberSwitchEventDialog {...removeTeamMemberDialogProps}/>
            <TeamMemberSwitchEventDialog {...addTeamMemberDialogProps}/>
        </>
    )
}

interface DialogOpenButtonProps {
    title: string
    openFn: () => void
}

function DialogOpenButton(props: DialogOpenButtonProps) {
    return (
        <Button data-testid="open-remove-team-member-dialog-button"
                style={{width: "150px", height: "150px", margin: "5px"}}
                variant="contained"
                size={"large"}
                startIcon={<AddIcon/>}
                onClick={props.openFn}>
            {props.title}
        </Button>
    )
}