export type NuzlockeRunTO = {
    id: number,
    username: string,
    name: string,
    game: string,
    rules: string[]
}

export type CreateNuzlockeRunTO = {
    name: string,
    game: string,
    rules: string[]
}
