package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.constants.enums.RunStatus
import net.namibsun.nuztrack.data.events.EncounterEvent

val NUZLOCKE_RUN = NuzlockeRun(
        userName = "Ash",
        name = "First",
        game = Games.FIRERED,
        rules = listOf(),
        customRules = listOf(),
        status = RunStatus.COMPLETED
)
val ENCOUNTER = EncounterEvent(
        NUZLOCKE_RUN,
        "Pallet Town",
        62,
        2,
        true
)
val TEAM_MEMBER = TeamMember(
        nickname = "Poli",
        pokedexNumber = 62,
        level = 78,
        gender = Gender.MALE,
        nature = Natures.BRAVE,
        abilitySlot = 1,
        encounter = ENCOUNTER
)