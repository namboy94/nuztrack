import {act, render, renderHook, screen, within} from "@testing-library/react";
import {EncounterEventDialog, EncounterEventDialogProps} from "./EncounterEventDialog";
import {useEncounterEventDialogProps} from "../hooks/EncounterEventDialog.hooks";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {eventsService} from "../../../data/events/events.service";
import {gamesService} from "../../../data/games/games.service";
import {NATURES, POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {of} from "rxjs";
import {ENCOUNTER_EVENT_SUCCESSFUL} from "../../../data/events/events.testconstants";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import userEvent from "@testing-library/user-event";

describe("EncounterEventDialog", () => {

    const notify = jest.fn()

    afterEach(() => {
        jest.resetAllMocks()
    })

    function generateProps(): EncounterEventDialogProps {
        jest.spyOn(pokedexService, "getPokedex$").mockReturnValue(of(POKEDEX))
        jest.spyOn(pokedexService, "getNatures$").mockReturnValue(of(NATURES))
        jest.spyOn(eventsService, "getEncounterEvents$").mockReturnValue(of([ENCOUNTER_EVENT_SUCCESSFUL]))
        jest.spyOn(gamesService, "getGameLocationRegistry$").mockReturnValue(of(LOCATION_REGISTRY))

        const hook = renderHook(() => useEncounterEventDialogProps(NUZLOCKE_RUN, notify)).result
        const [openFn,] = hook.current

        act(openFn)
        const [, props] = hook.current

        return props
    }

    function renderComponent(props: EncounterEventDialogProps) {
        render(<EncounterEventDialog {...props}/>)
    }

    it("should render all inputs", (done) => {
        const props = generateProps()
        renderComponent(props)

        const locationInput = screen.getByTestId("location-input")
        const pokemonSpeciesInput = screen.getByTestId("pokemon-species-input")
        const genderInput = screen.getByTestId("gender-input")
        const levelInput = screen.getByTestId("level-input")
        const caughtInput = screen.getByTestId("caught-input")
        const nicknameInput = screen.getByTestId("nickname-input")
        const natureInput = screen.getByTestId("nature-input")
        const abilitySlotInput = screen.getByTestId("ability-slot-input")

        expect(locationInput).toBeInTheDocument()
        expect(pokemonSpeciesInput).toBeInTheDocument()
        expect(genderInput).toBeInTheDocument()
        expect(levelInput).toBeInTheDocument()
        expect(caughtInput).toBeInTheDocument()
        expect(nicknameInput).toBeInTheDocument()
        expect(natureInput).toBeInTheDocument()
        expect(abilitySlotInput).toBeInTheDocument()

        expect(within(locationInput).getByRole("combobox").getAttribute("value")).toEqual(props.state.location)
        expect(within(pokemonSpeciesInput).getByRole("combobox").getAttribute("value")).toEqual("")
        //expect(genderInput.outerHTML).toEqual(props.state.gender)
        expect(parseInt(within(levelInput).getByRole("spinbutton").getAttribute("value")!!)).toEqual(props.state.level)
        expect(within(caughtInput).getByRole("checkbox").getAttribute("value")).toEqual(`${props.state.caught}`)
        //expect(within(nicknameInput).getByRole("textbox").getAttribute("value")).toEqual(props.state.nickname)
        //expect(within(natureInput).getByRole("combobox").getAttribute("value")).toEqual(props.state.nature)
        //expect(within(abilitySlotInput).getByRole("combobox").getAttribute("value")).toEqual(props.state.abilitySlot)

        userEvent.click(caughtInput)

        done()
    })
})