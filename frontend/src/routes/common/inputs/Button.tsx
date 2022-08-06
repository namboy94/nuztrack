import {Button} from "@mui/material";
import React from "react";
import {CommonProps} from "@mui/material/OverridableComponent";

export interface ButtonProps extends CommonProps {
    onClick: () => void
    title?: string
    color?: "error" | "success" | "info"
    testId?: string
}

export function GenericButton(props: ButtonProps) {
    return (
        <Button
            style={props.style}
            variant="contained"
            color={props.color ?? "info"}
            onClick={props.onClick}
            data-testid={props.testId ?? "generic-button"}
        >{props.title ?? "Button"}</Button>
    )
}

export function SubmitButton(props: ButtonProps) {
    return <GenericButton {...props}
                          title={props.title ?? "Submit"}
                          color={"success"}
                          testId={props.testId ?? "submit-button"}/>
}

export function CancelButton(props: ButtonProps) {
    return <GenericButton {...props}
                          title={props.title ?? "Cancel"}
                          color={"info"}
                          testId={props.testId ?? "cancel-button"}/>
}

export function DeleteButton(props: ButtonProps) {
    return <GenericButton {...props}
                          title={props.title ?? "Delete"}
                          color={"error"}
                          testId={props.testId ?? "delete-button"}/>
}