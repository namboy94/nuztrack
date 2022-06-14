import {useRunSelectorDataLoader} from "./hooks/runSelector.data.hook";
import {Button} from "@mui/material";
import * as React from "react";
import AddIcon from '@mui/icons-material/Add';
import {useDeleteRunDialogProps} from "./hooks/DeleteRunDialog.hooks";
import {CreateNewRunDialog} from "./components/CreateNewRunDialog";
import {useCreateNewRunDialogProps} from "./hooks/CreateNewRunDialog.hooks";
import {RouteProps} from "../common/RouteProps";
import {DeleteRunDialog} from "./components/DeleteRunDialog";
import {useRunsTableProps} from "./hooks/RunsTable.hooks";
import {RunsTable} from "./components/RunsTable";

export function RunSelectorRoute(props: RouteProps) {

    const loading = useRunSelectorDataLoader()
    const [openDeleteDialog, deleteDialogProps] = useDeleteRunDialogProps()
    const [openCreateDialog, createDialogProps] = useCreateNewRunDialogProps(props.notify)
    const runsTableProps = useRunsTableProps(props.notify, openDeleteDialog)

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <div>
            <Button variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openCreateDialog}>
                Create New Nuzlocke Run
            </Button>

            <div style={{height: 10}}/>

            <RunsTable {...runsTableProps}/>
            <CreateNewRunDialog {...createDialogProps}/>
            <DeleteRunDialog {...deleteDialogProps}/>

        </div>
    )
}