import {Gender, TeamMember} from "../../../../data/team/team.model";
import {Pokedex, PokemonSpecies} from "../../../../data/pokedex/pokedex.model";
import {ViewModel} from "../../../../util/viewmodel";
import {useQuery} from "../../../../util/hooks/observable";
import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {useState} from "react";
import {useResetState} from "../../../../util/hooks/state";
import {Game} from "../../../../data/games/games.model";

export interface PokemonInfoState {
    open: boolean
    nickname: string
    level: number
    gender: Gender | null
    nature: string | null
    species: PokemonSpecies
}

export interface PokemonInfoInteractions {
    openDialog: (teamMember: TeamMember) => void
    closeDialog: () => void,
    onChangeNickname: (newNickname: string) => void
    onChangeLevel: (newLevel: number) => void
    onChangeGender: (newGender: Gender) => void
    onChangeNature: (newNature: string) => void
    submit: () => void
}

export type PokemonInfoViewModel = ViewModel<PokemonInfoState, PokemonInfoInteractions>

export function usePokemonInfoViewModel(game: Game): PokemonInfoViewModel {
    const pokedex = useQuery(() => pokedexService.getPokedex$(game), undefined, []) ?? Pokedex.EMPTY

    const [open, setOpen] = useState(false)
    const [teamMember, setTeamMember, resetTeamMember] = useResetState<TeamMember | null>(null)
    const [species, setSpecies, resetSpecies] = useResetState<PokemonSpecies>(Pokedex.DEFAULT_POKEMON)
    const [nickname, setNickname, resetNickname] = useResetState("")
    const [level, setLevel, resetLevel] = useResetState(5)
    const [gender, setGender, resetGender] = useResetState<Gender | null>(Gender.MALE)
    const [nature, setNature, resetNature] = useResetState<string | null>("ADAMANT")

    const openDialog = (newTeamMember: TeamMember) => {
        setOpen(true)
        setTeamMember(teamMember)
        setSpecies(pokedex.getSpecies(newTeamMember.pokedexNumber))
        setNickname(newTeamMember.nickname)
        setLevel(newTeamMember.level)
        setGender(newTeamMember.gender)
        setNature(newTeamMember.nature)
    }

    const closeDialog = () => {
        setOpen(false)
        resetTeamMember()
        resetSpecies()
        resetNickname()
        resetLevel()
        resetNature()
        resetGender()
    }

    const submit = () => {

    }

    return {
        state: {
            open: open,
            nickname: nickname,
            level: level,
            nature: nature,
            gender: gender,
            species: species
        },
        interactions: {
            onChangeLevel: setLevel,
            onChangeGender: setGender,
            onChangeNature: setNature,
            onChangeNickname: setNickname,
            openDialog: openDialog,
            closeDialog: closeDialog,
            submit: submit
        }
    }
}