export type NuzlockeRun = {
    id: number,
    username: string,
    name: string,
    game: string,
    rules: string[],
    customRules: string[],
    status: "active" | "failed" | "completed"
}

export type CreateNuzlockeRun = {
    name: string,
    game: string,
    rules: string[],
    customRules: string[]
}
