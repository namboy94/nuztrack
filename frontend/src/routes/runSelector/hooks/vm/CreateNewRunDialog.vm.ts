import {useEffect, useState} from "react";
import {runsService} from "../../../../data/runs/runs.service";
import {rulesService} from "../../../../data/rules/rules.service";
import {gamesService} from "../../../../data/games/games.service";
import {DEFAULT_GAME, Game} from "../../../../data/games/games.model";
import {NotificationFN} from "../../../../global/Snackbar";
import {useQuery, useSubmitter} from "../../../../util/hooks/observable";
import {useResetState} from "../../../../util/hooks/state";
import {ViewModel} from "../../../../util/viewmodel";
import {DialogInteractions, DialogState} from "../../../common/Dialog";

export interface CreateNewRunDialogState extends DialogState {
    allGames: Game[]
    rulesOptions: Map<string, string>
    loading: boolean
    game: Game
    name: string
    rules: string[]
    customRules: string[]
}


export interface CreateNewRunDialogInteractions extends DialogInteractions {
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

    // eslint-disable-next-line
    useEffect(() => reset(), [rulesDetails, allGames])

    const openDialog = () => setOpen(true)
    const closeDialog = () => {
        setOpen(false)
        reset()
    }

    const onSubmitSuccess = () => {
        notify("Succesfully created Nuzlocke Run", "success")
        closeDialog()
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
            allGames: allGames ?? [DEFAULT_GAME],
            rulesOptions: rulesDetails?.rules ?? new Map<string, string>(),
            loading: allGames === undefined || rulesDetails === undefined,
            open: open,
            game: game,
            name: name,
            rules: rules,
            customRules: customRules
        },
        interactions: {
            submit: submit,
            openDialog: openDialog,
            closeDialog: closeDialog,
            onChangeName: setName,
            onChangeGame: setGame,
            toggleRule: toggleRule,
            onChangeCustomRules: setCustomRules
        }
    }
}
