import {RunRouteProps} from "../common/RouteProps";
import {useEventAdderDataLoader} from "./hooks/EventAdder.data.hook";
import {EncounterEventDialog} from "./components/EncounterEventDialog";
import AddIcon from "@mui/icons-material/Add";
import {Button} from "@mui/material";
import * as React from "react";
import {useNoteEventDialogViewModel} from "./hooks/vm/NoteEventDialog.hooks";
import {NoteEventDialog} from "./components/NoteEventDialog";
import {useEvolutionEventDialogViewModel} from "./hooks/vm/EvolutionEventDialog.vm";
import {EvolutionEventDialog} from "./components/EvolutionEventDialog";
import {DeathEventDialog} from "./components/DeathEventDialog";
import {useDeathEventDialogViewModel} from "./hooks/vm/DeathEventDialog.vm";
import {useMilestoneEventDialogViewModel} from "./hooks/vm/MilestoneEventDialog.hooks";
import {MilestoneEventDialog} from "./components/MilestoneEventDialog";
import {useTeamMemberSwitchEventDialogViewModel} from "./hooks/vm/TeamMemberSwitchEventDialog.vm";
import {SwitchType} from "../../data/events/events.model";
import {TeamMemberSwitchEventDialog} from "./components/TeamMemberSwitchEventDialog";
import {LoadingIndicator} from "../common/components/LoadingIndicator";
import {useEncounterEventDialogViewModel} from "./hooks/vm/EncounterEventDialog.vm";
import {ViewModel} from "../../util/viewmodel";
import {DialogInteractions, DialogState} from "../common/Dialog";

export function EventAdderRoute(props: RunRouteProps) {

    const loading = useEventAdderDataLoader(props.run)
    const encounterEventDialogViewModel = useEncounterEventDialogViewModel(props.run, props.notify)
    const noteEventDialogViewModel = useNoteEventDialogViewModel(props.run, props.notify)
    const evolutionEventDialogViewModel = useEvolutionEventDialogViewModel(props.run, props.notify)
    const deathEventDialogViewModel = useDeathEventDialogViewModel(props.run, props.notify)
    const milestoneEventDialogViewModel = useMilestoneEventDialogViewModel(props.run, props.notify)
    const removeTeamMemberDialogViewModel = useTeamMemberSwitchEventDialogViewModel(props.run, props.notify, SwitchType.REMOVE)
    const addTeamMemberDialogViewModel = useTeamMemberSwitchEventDialogViewModel(props.run, props.notify, SwitchType.ADD)

    if (loading) {
        return <LoadingIndicator/>
    }

    interface ButtonInfo {
        viewModel: ViewModel<DialogState, DialogInteractions>,
        title: string
    }

    const buttonInfos: ButtonInfo[] = [
        {viewModel: encounterEventDialogViewModel, title: "Encounter"},
        {viewModel: evolutionEventDialogViewModel, title: "Evolution"},
        {viewModel: deathEventDialogViewModel, title: "Death"},
        {viewModel: addTeamMemberDialogViewModel, title: "Add Team Member"},
        {viewModel: removeTeamMemberDialogViewModel, title: "Remove Team Member"},
        {viewModel: noteEventDialogViewModel, title: "Note"},
        {viewModel: milestoneEventDialogViewModel, title: "Milestone"},
    ]

    return (
        <>
            {buttonInfos.map((buttonInfo) =>
                <Button data-testid={`${buttonInfo.title.toLowerCase().replace(/ /gi, "-")}-dialog-button`}
                        key={buttonInfo.title}
                        style={{width: "150px", height: "150px", margin: "5px"}}
                        variant="contained"
                        size={"large"}
                        startIcon={<AddIcon/>}
                        onClick={buttonInfo.viewModel.interactions.openDialog}>
                    {buttonInfo.title}
                </Button>
            )}
            <EncounterEventDialog {...encounterEventDialogViewModel}/>
            <NoteEventDialog {...noteEventDialogViewModel}/>
            <EvolutionEventDialog {...evolutionEventDialogViewModel}/>
            <DeathEventDialog {...deathEventDialogViewModel}/>
            <MilestoneEventDialog {...milestoneEventDialogViewModel}/>
            <TeamMemberSwitchEventDialog {...removeTeamMemberDialogViewModel}/>
            <TeamMemberSwitchEventDialog {...addTeamMemberDialogViewModel}/>
        </>
    )
}
