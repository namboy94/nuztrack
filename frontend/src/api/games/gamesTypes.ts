export type GamesList = Map<string, string>
export type Location = {
    name: string,
    encounters: number[],
    milestones: Milestone[]
}
export type Milestone = {
    name: string,
    image: string,
    level_cap: number
}
