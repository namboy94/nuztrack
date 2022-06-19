import {useState} from "react";
import {CreateNewRunDialogProps, CreateNewRunDialogState} from "../components/CreateNewRunDialog";
import {NuzlockeRunCreator} from "../../../data/runs/runs.model";
import {runsService} from "../../../data/runs/runs.service";
import {rulesService} from "../../../data/rules/rules.service";
import {gamesService} from "../../../data/games/games.service";
import {RulesDetails} from "../../../data/rules/rules.model";
import {Game} from "../../../data/games/games.model";
import {NotificationFN} from "../../../components/Snackbar";
import {useQuery} from "../../../util/observable.hooks";

export function useCreateNewRunDialogProps(notify: NotificationFN): [() => void, CreateNewRunDialogProps] {

    const [open, setOpen] = useState(false)
    const rulesDetails = useQuery(() => rulesService.getRulesDetails$(), undefined, [])
    const games = useQuery(() => gamesService.getGames$(), undefined, [])
    const state = useCreateNewRunDialogState(games, rulesDetails)

    const openDialog = () => setOpen(true)
    const closeDialog = () => {
        setOpen(false)
        state.reset()
    }

    const submit = useCreateNewRunDialogSubmit(state, closeDialog, notify)

    const props = {
        open: open,
        onClose: closeDialog,
        games: games,
        rulesDetails: rulesDetails,
        state: state,
        submit: submit,
    }

    return [openDialog, props]
}

function useCreateNewRunDialogState(
    games: Game[] | undefined,
    rulesDetails: RulesDetails | undefined
): CreateNewRunDialogState {

    const defaultGame: Game = {
        generation: 1,
        key: "RED",
        title: "Red"
    }

    const [initialized, setInitialized] = useState(false)
    const [game, setGame] = useState(defaultGame)
    const [name, setName] = useState("")
    const [rules, setRules] = useState<string[]>([])
    const [customRules, setCustomRules] = useState<string[]>([])

    const reset = () => {
        setGame(games === undefined ? defaultGame : games[0])
        setName("")
        setRules(rulesDetails?.defaultRules ?? [])
        setCustomRules([])
    }
    if (!initialized && games !== undefined && rulesDetails !== undefined) {
        setInitialized(true)
        reset()
    }

    return {game, setGame, name, setName, rules, setRules, customRules, setCustomRules, reset}
}

function useCreateNewRunDialogSubmit(
    state: CreateNewRunDialogState,
    onClose: () => void,
    notify: NotificationFN
): () => void {

    const [submitting, setSubmitting] = useState(false)

    return () => {
        if (submitting) {
            return
        }
        setSubmitting(true)

        const creator: NuzlockeRunCreator = {
            customRules: state.customRules,
            game: state.game,
            name: state.name,
            rules: state.rules
        }
        runsService.addRun$(creator).subscribe({
            error: e => {
                notify(`Failed to create Nuzlocke Run: '${e.response.data.reason}'`, "error")
                setSubmitting(false)
            },
            next: result => {
                notify(`Succesfully created Nuzlocke Run '${result.name}'`, "success")
                onClose()
                setTimeout(() => setSubmitting(false), 1000)
            }
        })
    }
}
