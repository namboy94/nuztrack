import {useRunSelectorRouteViewModel} from "./hooks/runSelector.route.vm";
import {Button} from "@mui/material";
import * as React from "react";
import AddIcon from '@mui/icons-material/Add';
import {RunsTable} from "./components/runs.table.";
import {useDeleteRunDialog} from "./hooks/deleteRun.hook";
import {useCreateNewRunDialog} from "./hooks/createNewRun.hook";

export function RunSelectorRoute() {

    const [loading, runs] = useRunSelectorRouteViewModel()
    const [deleteDialog, openDeleteDialog] = useDeleteRunDialog()
    const [createDialog, openCreateDialog] = useCreateNewRunDialog()

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <div>
            <Button variant="contained"
                    size={"large"}
                    startIcon={<AddIcon/>}
                    onClick={openCreateDialog}
            >Create New Nuzlocke Run</Button>
            <RunsTable runs={runs} openDeleteDialog={openDeleteDialog}/>
            {createDialog}
            {deleteDialog}
        </div>
    )
}