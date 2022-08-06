import {NuzlockeRun} from "../../../data/runs/runs.model";
import {Box, Card, CardActions, CardMedia, Stack, Typography} from "@mui/material";
import {BACKEND_URL} from "../../../util/config";
import * as React from "react";
import {DeleteButton, GenericButton} from "../../common/inputs/Button";

export interface RunsTableEntryProps {
    run: NuzlockeRun
    active: boolean
    openDeleteDialog: (run: NuzlockeRun) => void
    selectActiveRun: (run: NuzlockeRun) => void
    closeRun: (run: NuzlockeRun) => void
}

const titleStyleBase = {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    color: "white",
}

export function RunsTableEntry(props: RunsTableEntryProps) {
    const {run, active, closeRun, selectActiveRun, openDeleteDialog} = props

    const textColor = active ? "black" : "white"
    const textBG = active ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.75)"
    const buttonFn = active ? closeRun : selectActiveRun
    const buttonColor = active ? "info" : "success"
    const buttonText = active ? "Close" : "Select"

    return (
        <Card>
            <Box sx={{position: 'relative'}}>
                <CardMedia
                    data-testid="run-image"
                    height="250"
                    component="img"
                    alt={run.game.title}
                    image={BACKEND_URL + "/covers/" + run.game.key + ".webp"}
                />
                <Box sx={{
                    ...titleStyleBase,
                    color: textColor,
                    padding: "10px",
                    paddingTop: "20px",
                    bgcolor: textBG,
                }}>
                    <Typography data-testid="run-title" variant="h4">{run.name}</Typography>
                    <Typography data-testid="run-status" variant="body1">{run.status}</Typography>

                </Box>
                <Box sx={titleStyleBase}>
                    <CardActions style={{justifyContent: 'right'}}>
                        <Stack direction={"column"}>
                            <DeleteButton onClick={() => openDeleteDialog(run)} testId={"open-delete-button"}/>
                            <GenericButton
                                onClick={() => buttonFn(run)}
                                color={buttonColor}
                                title={buttonText}
                                style={{margin: 3}}
                                testId={"select-button"}
                            />
                        </Stack>
                    </CardActions>
                </Box>
            </Box>
        </Card>
    )
}