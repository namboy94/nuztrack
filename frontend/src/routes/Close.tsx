import * as React from "react";
import {useEffect} from "react";
import {useNavigate} from "react-router";

export interface CloseProps {
    setRunId: (id: number) => void
}

export function Close(props: CloseProps) {

    const navigate = useNavigate()

    useEffect(() => {
        localStorage.removeItem("runId")
        props.setRunId(-1)
        navigate("/")
    })

    return <></>
}
