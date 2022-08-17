import {useRunSelectorDataLoader} from "./hooks/RunSelector.data.hook";
import {Button} from "@mui/material";
import * as React from "react";
import AddIcon from '@mui/icons-material/Add';
import {CreateNewRunDialog} from "./components/CreateNewRunDialog";
import {RouteProps} from "../common/RouteProps";
import {DeleteRunDialog} from "./components/DeleteRunDialog";
import {RunsTable} from "./components/RunsTable";
import {LoadingIndicator} from "../common/components/LoadingIndicator";
import {useRunsTableViewModel} from "./hooks/vm/RunsTable.vm";
import {useDeleteRunDialogViewModel} from "./hooks/vm/DeleteRunDialog.vm";
import {useCreateNewRunDialogViewModel} from "./hooks/vm/CreateNewRunDialog.vm";

export function RunSelectorRoute(props: RouteProps) {

    const loading = useRunSelectorDataLoader()
    const deleteRunDialogViewModel = useDeleteRunDialogViewModel(props.notify)
    const createNewRunDialogViewModel = useCreateNewRunDialogViewModel(props.notify)
    const runsTableViewModel = useRunsTableViewModel(props.notify, deleteRunDialogViewModel.interactions.open)

    if (loading) {
        return <LoadingIndicator/>
    }

    return (
        <div>
            <Button data-testid="open-create-button"
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={createNewRunDialogViewModel.interactions.open}>
                Create New Nuzlocke Run
            </Button>

            <div style={{height: 10}}/>

            <RunsTable {...runsTableViewModel}/>
            <CreateNewRunDialog {...createNewRunDialogViewModel}/>
            <DeleteRunDialog {...deleteRunDialogViewModel}/>
        </div>
    )
}