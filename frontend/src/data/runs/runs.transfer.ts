import {GameTO} from "../games/games.transfer";

export interface NuzlockeRunTO {
    id: number,
    username: string,
    name: string,
    game: GameTO,
    rules: string[],
    customRules: string[],
    status: string
}

export interface NuzlockeRunCreatorTO {
    name: string,
    game: string,
    rules: string[],
    customRules: string[]
}
