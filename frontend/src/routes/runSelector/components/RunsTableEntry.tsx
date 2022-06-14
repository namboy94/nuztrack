import {NuzlockeRun} from "../../../data/runs/runs.model";
import {Box, Button, Card, CardActions, CardMedia, Stack, Typography} from "@mui/material";
import {BACKEND_URL} from "../../../util/config";
import * as React from "react";

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
                    height="250"
                    component="img"
                    alt={run.game}
                    image={BACKEND_URL + "/covers/" + run.game + ".webp"}
                />
                <Box sx={{
                    ...titleStyleBase,
                    color: textColor,
                    padding: "10px",
                    paddingTop: "20px",
                    bgcolor: textBG,
                }}>
                    <Typography variant="h4">{run.name}</Typography>
                    <Typography variant="body1">{run.status}</Typography>

                </Box>
                <Box sx={titleStyleBase}>
                    <CardActions style={{justifyContent: 'right'}}>
                        <Stack direction={"column"}>
                            <Button color="error"
                                    variant="contained"
                                    style={{margin: 3}}
                                    onClick={() => openDeleteDialog(run)}>
                                Delete
                            </Button>
                            <Button color={buttonColor}
                                    variant="contained"
                                    style={{margin: 3}}
                                    onClick={() => buttonFn(run)}>
                                {buttonText}
                            </Button>
                        </Stack>


                    </CardActions>
                </Box>
            </Box>
        </Card>
    )
}