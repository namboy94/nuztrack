import {useEffect, useState} from "react";
import {runsService} from "../../../data/runs/runs.service";
import {rulesService} from "../../../data/rules/rules.service";
import {gamesService} from "../../../data/games/games.service";
import {RulesDetails} from "../../../data/rules/rules.model";
import {DEFAULT_GAME, Game} from "../../../data/games/games.model";
import {NotificationFN} from "../../../global/Snackbar";
import {useQuery, useSubmitter} from "../../../util/observable.hooks";
import {useResetState} from "../../../util/state.hook";
import {ViewModel} from "../../../util/viewmodel";

export interface CreateNewRunDialogState {
    allGames: Game[]
    rulesDetails: RulesDetails
    loading: boolean
    open: boolean,
    game: Game
    name: string
    rules: string[]
    customRules: string[]
}


export interface CreateNewRunDialogInteractions {
    open: () => void
    onClose: () => void
    submit: () => void
    onChangeGame: (game: Game) => void
    onChangeName: (name: string) => void
    toggleRule: (active: boolean, rule: string) => void
    onChangeCustomRules: (customRules: string[]) => void
}

export type CreateNewRunDialogViewModel = ViewModel<CreateNewRunDialogState, CreateNewRunDialogInteractions>

export function useCreateNewRunDialogViewModel(notify: NotificationFN): CreateNewRunDialogViewModel {

    const rulesDetails = useQuery(() => rulesService.getRulesDetails$(), undefined, [])
    const allGames = useQuery(() => gamesService.getGames$(), undefined, [])

    const [open, setOpen] = useState(false)
    const [game, setGame, resetGame] = useResetState(DEFAULT_GAME)
    const [name, setName, resetName] = useResetState("")
    const [rules, setRules] = useState<string[]>([])
    const [customRules, setCustomRules, resetCustomRules] = useResetState<string[]>([])

    const reset = () => {
        resetGame()
        resetName()
        setRules(rulesDetails?.defaultRules ?? [])
        resetCustomRules()
    }

    const toggleRule = (active: boolean, ruleOption: string) => {
        if (active) {
            setRules([...rules, ruleOption])
        } else {
            setRules(rules.filter(el => el !== ruleOption))
        }
    }

    useEffect(() => reset(), [rulesDetails, allGames])

    const openDialog = () => setOpen(true)
    const onClose = () => {
        setOpen(false)
        reset()
    }

    const onSubmitSuccess = () => {
        notify("Succesfully created Nuzlocke Run", "success")
        onClose()
    }

    const onSubmitError = (e: any) => notify(`Failed to create Nuzlocke Run: '${e.response.data.reason}'`, "error")

    const submit = useSubmitter(() => runsService.addRun$({
        customRules: customRules,
        game: game,
        name: name,
        rules: rules
    }), onSubmitSuccess, onSubmitError)

    return {
        state: {
            allGames: allGames ?? [],
            rulesDetails: rulesDetails ?? {rules: new Map<string, string>(), defaultRules: []},
            loading: allGames === undefined || rulesDetails === undefined,
            open: open,
            game: game,
            name: name,
            rules: rules,
            customRules: customRules
        },
        interactions: {
            open: openDialog,
            submit: submit,
            onClose: onClose,
            onChangeName: setName,
            onChangeGame: setGame,
            toggleRule: toggleRule,
            onChangeCustomRules: setCustomRules
        }
    }
}
