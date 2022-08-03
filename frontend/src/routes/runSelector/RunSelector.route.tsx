import {useRunSelectorDataLoader} from "./hooks/RunSelector.data.hook";
import {Button} from "@mui/material";
import * as React from "react";
import AddIcon from '@mui/icons-material/Add';
import {useDeleteRunDialogProps} from "./hooks/DeleteRunDialog.hooks";
import {CreateNewRunDialog} from "./components/CreateNewRunDialog";
import {useCreateNewRunDialogViewModel} from "./hooks/CreateNewRunDialog.hooks";
import {RouteProps} from "../common/RouteProps";
import {DeleteRunDialog} from "./components/DeleteRunDialog";
import {useRunsTableProps} from "./hooks/RunsTable.hooks";
import {RunsTable} from "./components/RunsTable";
import {LoadingIndicator} from "../common/components/LoadingIndicator";

export function RunSelectorRoute(props: RouteProps) {

    const loading = useRunSelectorDataLoader()
    const [openDeleteDialog, deleteDialogProps] = useDeleteRunDialogProps(props.notify)
    const createDialogProps = useCreateNewRunDialogViewModel(props.notify)
    const runsTableProps = useRunsTableProps(props.notify, openDeleteDialog)

    if (loading) {
        return <LoadingIndicator/>
    }

    return (
        <div>
            <Button data-testid="open-create-button"
                    variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={createDialogProps.interactions.open}>
                Create New Nuzlocke Run
            </Button>

            <div style={{height: 10}}/>

            <RunsTable {...runsTableProps}/>
            <CreateNewRunDialog {...createDialogProps}/>
            <DeleteRunDialog {...deleteDialogProps}/>

        </div>
    )
}