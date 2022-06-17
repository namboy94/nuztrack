import {NuzlockeRun} from "../../../data/runs/runs.model";
import {useQuery} from "../../../util/observable.hooks";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {eventsService} from "../../../data/events/events.service";
import {gamesService} from "../../../data/games/games.service";
import {EncounterEventDialogProps, EncounterEventDialogState} from "../components/EncounterEventDialog";
import {useState} from "react";
import {Gender} from "../../../data/team/team.model";
import {NotificationFN} from "../../../components/Snackbar";
import {CreateEncounterEvent, CreateEncounterPokemon} from "../../../data/events/events.model";

export function useEncounterEventDialogProps(
    run: NuzlockeRun,
    notify: NotificationFN
): [() => void, EncounterEventDialogProps] {

    const [open, setOpen] = useState(false)
    const pokedex = useQuery(() => pokedexService.getPokedex$(), undefined, [])
    const natures = useQuery(() => pokedexService.getNatures$(), [], [])
    const encounters = useQuery(() => eventsService.getEncounterEvents$(run.id), [], [])
    const encounterLocations = encounters.map(encounter => encounter.location)
    const locations = useQuery(() => gamesService.getGameLocations$(run.game), [], []).filter(
        location => !encounterLocations.includes(location.name)
    )
    const state = useEncounterEventDialogState()

    const onClose = () => {
        setOpen(false)
        state.reset()
    }

    const submit = useEncounterEventSubmit(run, state, onClose, notify)

    return [
        () => setOpen(true),
        {
            locations: locations,
            natures: natures,
            onClose: onClose,
            open: open,
            pokedex: pokedex,
            state: state,
            submit: submit
        }
    ]
}

function useEncounterEventDialogState(): EncounterEventDialogState {
    const [location, setLocation] = useState("")
    const [pokemonSpecies, setPokemonSpecies] = useState(1)
    const [level, setLevel] = useState(5)
    const [gender, setGender] = useState(Gender.MALE)
    const [caught, setCaught] = useState(false)
    const [nickname, setNickname] = useState("")
    const [nature, setNature] = useState("ADAMANT")
    const [abilitySlot, setAbilitySlot] = useState(1)

    const reset = () => {
        setLocation("")
        setPokemonSpecies(1)
        setLevel(5)
        setGender(Gender.MALE)
        setCaught(false)
        setNickname("")
        setNature("ADAMANT")
        setAbilitySlot(1)
    }

    return {
        location: location,
        setLocation: setLocation,
        pokemonSpecies: pokemonSpecies,
        setPokemonSpecies: setPokemonSpecies,
        level: level,
        setLevel: setLevel,
        gender: gender,
        setGender: setGender,
        caught: caught,
        setCaught: setCaught,
        nickname: nickname,
        setNickname: setNickname,
        nature: nature, setNature,
        abilitySlot: abilitySlot, setAbilitySlot,
        reset: reset
    }
}

function useEncounterEventSubmit(
    run: NuzlockeRun,
    state: EncounterEventDialogState,
    onClose: () => void,
    notify: NotificationFN
): () => void {
    const pokemon: CreateEncounterPokemon = {
        abilitySlot: state.abilitySlot,
        gender: state.gender,
        nature: state.nature,
        nickname: state.nickname
    }
    const creator: CreateEncounterEvent = {
        location: state.location,
        pokedexNumber: state.pokemonSpecies,
        level: state.level,
        caught: state.caught,
        pokemon: pokemon
    }
    return () => {
        eventsService.createEncounterEvent$(run.id, creator).subscribe({
            next: () => {
                notify("Encounter was saved successfully", "success")
                onClose()
            },
            error: e => {
                notify(`Failed to create encounter event: ${e}`, "error")
            }
        })
    }
}