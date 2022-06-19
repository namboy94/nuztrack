import {NuzlockeRun} from "../../../data/runs/runs.model";
import {useQuery, useSubmitter} from "../../../util/observable.hooks";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {eventsService} from "../../../data/events/events.service";
import {gamesService} from "../../../data/games/games.service";
import {EncounterEventDialogProps, EncounterEventDialogState} from "../components/EncounterEventDialog";
import {useState} from "react";
import {Gender} from "../../../data/team/team.model";
import {NotificationFN} from "../../../components/Snackbar";
import {CreateEncounterEvent, CreateEncounterPokemon} from "../../../data/events/events.model";
import {Pokedex, PokemonSpecies} from "../../../data/pokedex/pokedex.model";
import {GameLocationRegistry} from "../../../data/games/games.model";
import {useResetState} from "../../../util/state.hook";

export function useEncounterEventDialogProps(
    run: NuzlockeRun,
    notify: NotificationFN
): [() => void, EncounterEventDialogProps] {

    const [open, setOpen] = useState(false)
    const pokedex = useQuery(() => pokedexService.getPokedex$(), undefined, [])
    const natures = useQuery(() => pokedexService.getNatures$(), [], [])
    const encounters = useQuery(() => eventsService.getEncounterEvents$(run.id), [], [])
    const encounterLocations = encounters.map(encounter => encounter.location)
    const locationRegistry = useQuery(() => gamesService.getGameLocationRegistry$(run.game), undefined, [])
    const locations = locationRegistry?.getLocationNames().filter(x => !encounterLocations.includes(x)) ?? []
    const state = useEncounterEventDialogState(run, pokedex, locationRegistry)

    const onClose = () => {
        setOpen(false)
        state.reset()
    }

    const submit = useEncounterEventSubmit(run, state, onClose, notify)

    return [
        () => setOpen(true),
        {
            run: run,
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

function useEncounterEventDialogState(
    run: NuzlockeRun,
    pokedex: Pokedex | undefined,
    locationRegistry: GameLocationRegistry | undefined
): EncounterEventDialogState {
    const [pokemonSpecies, setPokemonSpecies, resetPokemonSpecies] = useResetState<PokemonSpecies | null>(null)
    const [location, setLocation, resetLocation] = useResetState("")
    const [possibleEncounters, setPossibleEncounters, resetPossibleEncounters] = useResetState<PokemonSpecies[]>([])
    const [level, setLevel, resetLevel] = useResetState(5)
    const [gender, setGender, resetGender] = useResetState(Gender.MALE)
    const [caught, setCaught, resetCaught] = useResetState(false)
    const [nickname, setNickname, resetNickname] = useResetState("")
    const [nature, setNature, resetNature] = useResetState("ADAMANT")
    const [abilitySlot, setAbilitySlot, resetAbilitySlot] = useResetState(1)
    const [possibleAbilitySlots, setPossibleAbilitySlots, resetPossibleAbilitySlots] = useResetState([1])

    const reset = () => {
        resetLocation()
        resetPokemonSpecies()
        resetPossibleEncounters()
        resetLevel()
        resetGender()
        resetCaught()
        resetCaptureDetails()
    }

    const resetCaptureDetails = () => {
        resetCaught()
        resetNickname()
        resetNature()
        resetAbilitySlot()
        resetPossibleAbilitySlots()
    }

    const selectLocation = (newLocation: string) => {
        reset()
        setLocation(newLocation)
        const gameLocation = locationRegistry?.getLocationByName(newLocation) ?? null
        if (gameLocation !== null && pokedex !== undefined) {
            setPossibleEncounters(gameLocation.encounters.map(x => pokedex.getSpecies(x)))
        }
    }

    const selectPokemonSpecies = (newSpecies: PokemonSpecies | null) => {
        resetCaptureDetails()
        if (newSpecies !== null) {
            setPokemonSpecies(newSpecies)
            setPossibleAbilitySlots(pokedex?.getValidAbilitySlots(newSpecies.pokedexNumber) ?? [1])
        }
    }

    const selectLevel = (newLevel: number) => {
        if (newLevel >= 1 && newLevel <= 100) {
            setLevel(newLevel)
        }
    }

    const handleCaught = (newCaught: boolean) => {
        if (newCaught && pokemonSpecies !== null) {
            setCaught(true)
        } else {
            resetCaptureDetails()
            setCaught(false)
        }
    }

    const selectNickname = (newNickname: string) => {
        const maxsize = run.game.generation <= 5 ? 10 : 12
        if (newNickname.length <= maxsize) {
            setNickname(newNickname)
        }
    }

    return {
        location: location,
        setLocation: selectLocation,
        pokemonSpecies: pokemonSpecies,
        setPokemonSpecies: selectPokemonSpecies,
        possibleEncounters: possibleEncounters,
        level: level,
        setLevel: selectLevel,
        gender: gender,
        setGender: setGender,
        caught: caught,
        setCaught: handleCaught,
        nickname: nickname,
        setNickname: selectNickname,
        nature: nature, setNature,
        abilitySlot: abilitySlot, setAbilitySlot,
        possibleAbilitySlots: possibleAbilitySlots,
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
        pokedexNumber: state.pokemonSpecies?.pokedexNumber ?? -1,
        level: state.level,
        caught: state.caught,
        pokemon: pokemon
    }

    if (!state.caught) {
        creator.pokemon = null
    }

    if (creator.pokemon !== null) {
        if (run.game.generation === 1) {
            creator.pokemon.gender = null
        }
        if (run.game.generation < 3) {
            creator.pokemon.nature = null
            creator.pokemon.abilitySlot = null
        }
    }

    const onSuccess = () => {
        notify("Encounter was saved successfully", "success")
        onClose()
    }

    const onError = (e: any) => notify(`Failed to create encounter event: ${e.response.data.reason}`, "error")

    return useSubmitter(() => eventsService.createEncounterEvent$(run.id, creator), onSuccess, onError)
}
