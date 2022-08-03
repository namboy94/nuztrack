import {CreateMultiRun, MultiRunOption, NuzlockeRun} from "../../../data/runs/runs.model";
import {NotificationFN} from "../../../global/Snackbar";
import {NextGameDialogProps, NextGameDialogState} from "../components/NextGameDialog";
import {useState} from "react";
import {useQuery, useSubmitter} from "../../../util/hooks/observable";
import {gamesService} from "../../../data/games/games.service";
import {runsService} from "../../../data/runs/runs.service";
import {Game} from "../../../data/games/games.model";
import {useResetState} from "../../../util/hooks/state";

export function useNextGameDialogProps(run: NuzlockeRun, notify: NotificationFN): [() => void, NextGameDialogProps] {
    const [open, setOpen] = useState(false)
    const options = useQuery(() => runsService.getMultiRunOptions$(), [], [])
    const games = useQuery(() => gamesService.getGames$(), [], []) ?? []
    const state = useNextGameDialogState(options)

    const onClose = () => {
        setOpen(false)
        state.reset()
    }

    const submit = useSubmitNextGame(run, notify, onClose, state)

    const props: NextGameDialogProps = {
        open: open,
        onClose: onClose,
        state: state,
        games: games,
        options: options,
        submit: submit
    }

    return [() => setOpen(true), props]
}

function useNextGameDialogState(multiRunOptions: MultiRunOption[]): NextGameDialogState {
    const defaultGame: Game = {title: "FireRed", generation: 3, key: "FIRERED"}
    const [game, setGame, resetGame] = useResetState(defaultGame)
    const [name, setName, resetName] = useResetState("")
    const [options, setOptions, resetOptions] = useResetState(multiRunOptions.map(x => x.key))

    const reset = () => {
        resetGame()
        resetName()
        resetOptions()
    }

    return {
        newGame: game,
        setNewGame: setGame,
        newName: name, setNewName:
        setName,
        options: options,
        setOptions: setOptions,
        reset: reset
    }
}

function useSubmitNextGame(run: NuzlockeRun, notify: NotificationFN, onClose: () => void, state: NextGameDialogState) {
    const creator: CreateMultiRun = {game: state.newGame, name: state.newName, options: state.options, runId: run.id}
    const onSuccess = () => {
        notify("Successfully created new run for the next game", "success")
        onClose()
    }
    const onError = (e: any) => {
        notify(`Failed to create new run for next game:${e.response.data.reason}`, "error")
    }
    return useSubmitter(() => runsService.continueMultiRun$(creator), onSuccess, onError)
}