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
    const state = useEncounterEventDialogState(pokedex, locationRegistry)

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
    pokedex: Pokedex | undefined,
    locationRegistry: GameLocationRegistry | undefined
): EncounterEventDialogState {
    const [pokemonSpecies, setPokemonSpecies, resetPokemonSpecies] =
        useResetState<PokemonSpecies | undefined>(undefined)
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
        resetNickname()
        resetNature()
        resetAbilitySlot()
        resetPossibleAbilitySlots()
    }

    const selectLocation = (location: string) => {
        reset()
        setLocation(location)
        const gameLocation = locationRegistry?.getLocationByName(location) ?? null
        if (gameLocation !== null && pokedex !== undefined) {
            setPossibleEncounters(gameLocation.encounters.map(x => pokedex.getSpecies(x)))
        }
    }

    const selectPokemonSpecies = (species: PokemonSpecies | undefined) => {
        resetCaptureDetails()
        if (species !== undefined) {
            setPokemonSpecies(species)
            setPossibleAbilitySlots(pokedex?.getValidAbilitySlots(species.pokedexNumber) ?? [1])
        }
    }

    const handleCaught = (caught: boolean) => {
        if (caught && pokemonSpecies !== null) {
            setCaught(caught)
        }
        if (!caught) {
            resetCaptureDetails()
        }
    }

    return {
        location: location,
        setLocation: selectLocation,
        pokemonSpecies: pokemonSpecies,
        setPokemonSpecies: selectPokemonSpecies,
        possibleEncounters: possibleEncounters,
        level: level,
        setLevel: setLevel,
        gender: gender,
        setGender: setGender,
        caught: caught,
        setCaught: handleCaught,
        nickname: nickname,
        setNickname: setNickname,
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