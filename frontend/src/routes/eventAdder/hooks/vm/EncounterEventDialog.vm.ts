import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {useQuery, useSubmitter} from "../../../../util/hooks/observable";
import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {eventsService} from "../../../../data/events/events.service";
import {gamesService} from "../../../../data/games/games.service";
import {useState} from "react";
import {Gender} from "../../../../data/team/team.model";
import {NotificationFN} from "../../../../global/Snackbar";
import {CreateEncounterEvent, CreateEncounterPokemon} from "../../../../data/events/events.model";
import {Pokedex, PokemonSpecies} from "../../../../data/pokedex/pokedex.model";
import {useResetState} from "../../../../util/hooks/state";
import {ViewModel} from "../../../../util/viewmodel";
import {DialogInteractions, DialogState} from "../../../common/Dialog";
import {Game} from "../../../../data/games/games.model";
import {useLevelInput} from "../../../common/hooks/levelInput.hook";
import {useNicknameInput} from "../../../common/hooks/nicknameInput.hook";

export interface EncounterEventDialogState extends DialogState {
    run: NuzlockeRun
    pokedex: Pokedex
    locations: string[]
    possibleEncounters: PokemonSpecies[]
    pokemonSpecies: PokemonSpecies | null
    location: string
    level: number | null
    gender: Gender
    caught: boolean
    nickname: string
    nature: string
    abilitySlot: number
    possibleAbilitySlots: number[]
}

export interface EncounterEventDialogInteractions extends DialogInteractions {
    onChangeLocation: (location: string) => void
    onChangePokemonSpecies: (pokemonSpecies: PokemonSpecies | null) => void
    onChangeLevel: (level: number | null) => void
    onChangeGender: (gender: Gender) => void
    onChangeCaught: (caught: boolean) => void
    onChangeNickname: (nickname: string) => void
    onChangeNature: (nature: string) => void
    onChangeAbilitySlot: (abilitySlot: number) => void
}

export type EncounterEventDialogViewModel = ViewModel<EncounterEventDialogState, EncounterEventDialogInteractions>

export function useEncounterEventDialogViewModel(
    run: NuzlockeRun,
    notify: NotificationFN
): EncounterEventDialogViewModel {

    const pokedex = useQuery(() => pokedexService.getPokedex$(run.game), undefined, [])
    const encounters = useQuery(() => eventsService.getEncounterEvents$(run.id), [], [])
    const locationRegistry = useQuery(() => gamesService.getGameLocationRegistry$(run.game), undefined, [])
    const encounterLocations = encounters.map(encounter => encounter.location)
    const locations = locationRegistry?.getLocationNames().filter(x => !encounterLocations.includes(x)) ?? []

    const [open, setOpen] = useState(false)
    const [pokemonSpecies, setPokemonSpecies, resetPokemonSpecies] = useResetState<PokemonSpecies | null>(null)
    const [location, setLocation, resetLocation] = useResetState("")
    const [possibleEncounters, setPossibleEncounters, resetPossibleEncounters] = useResetState<PokemonSpecies[]>([])
    const [level, setLevel] = useLevelInput(5)
    const [gender, setGender, resetGender] = useResetState(Gender.MALE)
    const [caught, setCaught, resetCaught] = useResetState(false)
    const [nickname, setNickname] = useNicknameInput(run.game.generation)
    const [nature, setNature, resetNature] = useResetState("ADAMANT")
    const [abilitySlot, setAbilitySlot, resetAbilitySlot] = useResetState(1)
    const [possibleAbilitySlots, setPossibleAbilitySlots, resetPossibleAbilitySlots] = useResetState([1])

    const reset = () => {
        resetLocation()
        resetPokemonSpecies()
        resetPossibleEncounters()
        setLevel(5)
        resetGender()
        resetCaught()
        resetCaptureDetails()
    }

    const resetCaptureDetails = () => {
        resetCaught()
        setNickname("")
        resetNature()
        resetAbilitySlot()
        resetPossibleAbilitySlots()
    }

    const onChangeLocation = (newLocation: string) => {
        reset()
        setLocation(newLocation)
        const gameLocation = locationRegistry?.getLocationByName(newLocation) ?? null
        if (gameLocation !== null && pokedex !== undefined) {
            setPossibleEncounters(gameLocation.encounters.map(x => pokedex.getSpecies(x)))
        }
    }

    const onChangePokemonSpecies = (newSpecies: PokemonSpecies | null) => {
        resetCaptureDetails()
        if (newSpecies !== null) {
            setPokemonSpecies(newSpecies)
            setPossibleAbilitySlots(pokedex?.getValidAbilitySlots(newSpecies.pokedexNumber) ?? [1])
        }
    }

    const onChangeCaught = (newCaught: boolean) => {
        if (newCaught && pokemonSpecies !== null) {
            setCaught(true)
        } else {
            resetCaptureDetails()
            setCaught(false)
        }
    }

    const onSuccess = () => {
        notify("Encounter was saved successfully", "success")
        closeDialog()
    }

    const onError = (e: any) => notify(`Failed to create encounter event: ${e.response.data.reason}`, "error")

    const submit = useSubmitter(() => eventsService.createEncounterEvent$(run.id,
        buildSubmission(
            run.game,
            pokemonSpecies,
            location,
            level,
            caught,
            abilitySlot,
            gender,
            nature,
            nickname
        )
    ), onSuccess, onError)

    const openDialog = () => {
        setOpen(true)
    }

    const closeDialog = () => {
        setOpen(false)
        reset()
    }

    const state: EncounterEventDialogState = {
        run: run,
        abilitySlot: abilitySlot,
        caught: caught,
        gender: gender,
        level: level,
        location: location,
        locations: locations,
        nature: nature,
        nickname: nickname,
        open: open,
        pokedex: pokedex ?? Pokedex.EMPTY,
        pokemonSpecies: pokemonSpecies,
        possibleAbilitySlots: possibleAbilitySlots,
        possibleEncounters: possibleEncounters
    }
    const interactions: EncounterEventDialogInteractions = {
        closeDialog: closeDialog,
        onChangeAbilitySlot: setAbilitySlot,
        onChangeCaught: onChangeCaught,
        onChangeGender: setGender,
        onChangeLevel: setLevel,
        onChangeLocation: onChangeLocation,
        onChangeNature: setNature,
        onChangeNickname: setNickname,
        onChangePokemonSpecies: onChangePokemonSpecies,
        openDialog: openDialog,
        submit: submit
    }
    return {state: state, interactions: interactions}
}

function buildSubmission(
    game: Game,
    pokemonSpecies: PokemonSpecies | null,
    location: string,
    level: number | null,
    caught: boolean,
    abilitySlot: number,
    gender: Gender,
    nature: string,
    nickname: string
): CreateEncounterEvent {

    const pokemon: CreateEncounterPokemon = {
        abilitySlot: abilitySlot,
        gender: gender,
        nature: nature,
        nickname: nickname
    }
    const creator: CreateEncounterEvent = {
        location: location,
        pokedexNumber: pokemonSpecies?.pokedexNumber ?? -1,
        level: level ?? 0,
        caught: caught,
        pokemon: pokemon
    }

    if (!caught) {
        creator.pokemon = null
    }

    if (creator.pokemon !== null) {
        if (game.generation === 1) {
            creator.pokemon.gender = null
        }
        if (game.generation < 3) {
            creator.pokemon.nature = null
            creator.pokemon.abilitySlot = null
        }
    }
    return creator
}