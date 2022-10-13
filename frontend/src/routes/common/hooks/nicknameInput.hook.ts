import {useState} from "react";

export function useNicknameInput(generation: number): [string, (nickname: string) => void] {
    const [nickname, setNickname] = useState("")
    const maxsize = generation <= 5 ? 10 : 12

    const onChange = (newNickname: string) => {
        if (newNickname.length <= maxsize) {
            setNickname(newNickname)
        }
    }

    return [nickname, onChange]
}
