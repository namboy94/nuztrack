export type NuzlockeRunTO = {
    id: number,
    username: string,
    name: string,
    game: string,
    rules: string[],
    customRules: string[],
    status: string
}

export type CreateNuzlockeRunTO = {
    name: string,
    game: string,
    rules: string[],
    customRules: string[]
}
