export type RulesMappingTO = {
    [key: string]: string
}

export type RulesDetailsTO = {
    rules: RulesMappingTO,
    defaultRules: string[]
}

export type RulesDetails = {
    rules: Map<string, string>,
    defaultRules: string[]
}