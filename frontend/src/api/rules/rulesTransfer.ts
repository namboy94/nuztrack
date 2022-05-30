export type RulesDetailsTO = {
    rules: { [key: string]: string },
    defaultRules: string[]
}

export type RulesDetails = {
    rules: Map<string, string>,
    defaultRules: string[]
}