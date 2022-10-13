import {TextField} from "@mui/material";
import React from "react";

export interface NicknameInputProps {
    nickname: string,
    onChangeNickname: (newNickname: string) => void
}

export function NicknameInput(props: NicknameInputProps) {
    return (<TextField
        sx={{margin: 1, width: 315}}
        data-testid="nickname-input"
        label="Nickname"
        value={props.nickname}
        onChange={x => props.onChangeNickname(x.target.value)}
    />)
}