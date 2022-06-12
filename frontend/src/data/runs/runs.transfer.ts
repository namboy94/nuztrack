export interface NuzlockeRunTO {
    id: number,
    username: string,
    name: string,
    game: string,
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
