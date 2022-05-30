export type NuzlockeRunTO = {
    id: number,
    username: string,
    name: string,
    game: string,
    rules: string[],
    customRules: string[],
    status: "active" | "failed" | "completed"
}
export type NuzlockeRun = NuzlockeRunTO

export type CreateNuzlockeRunTO = {
    name: string,
    game: string,
    rules: string[],
    customRules: string[]
}
export type CreateNuzlockeRun = CreateNuzlockeRunTO