package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.*
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.data.events.EncounterEventService
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEventService
import net.namibsun.nuztrack.transfer.events.CreateEncounterEventTO
import net.namibsun.nuztrack.transfer.events.CreateEncounterPokemonTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.*
import org.springframework.http.HttpStatus
import java.security.Principal

internal class EncounterEventControllerTest {

    private val principal: Principal = mock()
    private val runsService: NuzlockeRunService = mock()
    private val teamMemberService: TeamMemberService = mock()
    private val teamMemberSwitchEventService: TeamMemberSwitchEventService = mock()
    private val service: EncounterEventService = mock()
    private val controller = EncounterEventController(
        service, teamMemberService, teamMemberSwitchEventService, runsService
    )

    private val user = "Ash"
    val rules = listOf(
        Rules.ONLY_FIRST_ENCOUNTER,
        Rules.DUPLICATE_CLAUSE,
        Rules.DUPLICATE_CLAUSE_INCLUDES_FAILED_ENCOUNTERS,
        Rules.DUPLICATE_CLAUSE_INCLUDES_ENTIRE_SPECIES
    )
    private val nuzlockeRun = NuzlockeRun(5, user, "First", Games.FIRERED, rules, listOf(), RunStatus.COMPLETED)
    private val encounterOne = EncounterEvent(nuzlockeRun, "Pewter City", 4, 14, true)
    private val encounterTwo = EncounterEvent(nuzlockeRun, "Mahogany Town", 7, 24, false)
    private val teamMember = TeamMember(0, "Nick", 120, 34, Gender.MALE, Natures.BOLD, 1, encounterOne)
    private val encounterOneWithTeamMember = EncounterEvent(
        encounterOne.nuzlockeRun,
        encounterOne.location,
        encounterOne.pokedexNumber,
        encounterOne.level,
        encounterOne.caught,
        teamMember
    )

    private val creatorOne = CreateEncounterEventTO(
        encounterOne.location,
        encounterOne.pokedexNumber,
        encounterOne.level,
        encounterOne.caught,
        CreateEncounterPokemonTO(
            teamMember.nickname,
            teamMember.gender?.name,
            teamMember.nature?.name,
            teamMember.abilitySlot
        )
    )
    private val creatorTwo = CreateEncounterEventTO(
        encounterTwo.location,
        encounterTwo.pokedexNumber,
        encounterTwo.level,
        encounterTwo.caught,
        null
    )


    @Test
    fun createEncounterEvent_successfulCapture() {
        whenever(principal.name).thenReturn(user)
        whenever(runsService.getRun(nuzlockeRun.id)).thenReturn(nuzlockeRun)
        whenever(
            service.createEncounterEvent(
                nuzlockeRun,
                encounterOne.location,
                encounterOne.pokedexNumber,
                encounterOne.level,
                true
            )
        ).thenReturn(encounterOneWithTeamMember)
        whenever(
            teamMemberService.createTeamMember(
                encounterOne,
                teamMember.nickname,
                teamMember.gender,
                teamMember.nature,
                teamMember.abilitySlot
            )
        ).thenReturn(teamMember)
        whenever(service.getLocationsWithEncounters(nuzlockeRun.id)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(nuzlockeRun.id, true)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(nuzlockeRun.id, false)).thenReturn(listOf())

        val result = controller.createEncounterEvent(nuzlockeRun.id, creatorOne, principal)

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(result.body!!.caught).isEqualTo(true)
        assertThat(result.body!!.teamMemberId).isNotNull

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(any())
        verify(service, times(1)).createEncounterEvent(any(), any(), any(), any(), any())
        verify(teamMemberService, times(1)).createTeamMember(any(), any(), any(), any(), any())
        verify(service, times(1)).getLocationsWithEncounters(nuzlockeRun.id)
        verify(service, times(1)).getEncounteredSpecies(nuzlockeRun.id, true)
        verify(service, times(1)).getEncounteredSpecies(nuzlockeRun.id, false)
    }

    @Test
    fun createEncounterEvent_successfulCaptureWithOldGame() {
        val run = NuzlockeRun(0, "Tester", "test", Games.RED, listOf(), listOf(), RunStatus.ACTIVE)
        val creator = CreateEncounterEventTO(
            "A", 1, 1, true, CreateEncounterPokemonTO(
                "A", null, null, null
            )
        )
        whenever(principal.name).thenReturn(run.userName)
        whenever(runsService.getRun(run.id)).thenReturn(run)
        whenever(service.getLocationsWithEncounters(run.id)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(run.id, true)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(run.id, false)).thenReturn(listOf())
        whenever(service.createEncounterEvent(any(), any(), any(), any(), any())).thenReturn(encounterOneWithTeamMember)
        whenever(teamMemberService.createTeamMember(any(), any(), any(), any(), any())).thenReturn(teamMember)

        assertDoesNotThrow {
            val result = controller.createEncounterEvent(run.id, creator, principal)
            assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        }

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(any())
        verify(service, times(1)).createEncounterEvent(any(), any(), any(), any(), any())
        verify(teamMemberService, times(1)).createTeamMember(
            encounterOneWithTeamMember, creator.pokemon!!.nickname, null, null, null
        )
    }

    @Test
    fun createEncounterEvent_failedCapture() {
        whenever(principal.name).thenReturn(user)
        whenever(runsService.getRun(nuzlockeRun.id)).thenReturn(nuzlockeRun)
        whenever(
            service.createEncounterEvent(
                nuzlockeRun,
                encounterTwo.location,
                encounterTwo.pokedexNumber,
                encounterTwo.level,
                false
            )
        ).thenReturn(encounterTwo)
        whenever(service.getLocationsWithEncounters(nuzlockeRun.id)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(nuzlockeRun.id, true)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(nuzlockeRun.id, false)).thenReturn(listOf())

        val result = controller.createEncounterEvent(nuzlockeRun.id, creatorTwo, principal)

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(result.body!!.caught).isEqualTo(false)
        assertThat(result.body!!.teamMemberId).isNull()

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(any())
        verify(service, times(1)).createEncounterEvent(any(), any(), any(), any(), any())
        verify(teamMemberService, times(0)).createTeamMember(any(), any(), any(), any(), any())
        verify(service, times(1)).getLocationsWithEncounters(nuzlockeRun.id)
        verify(service, times(1)).getEncounteredSpecies(nuzlockeRun.id, true)
        verify(service, times(1)).getEncounteredSpecies(nuzlockeRun.id, false)
    }

    @Test
    fun createEncounterEvent_validationError() {
        whenever(principal.name).thenReturn(user)
        whenever(runsService.getRun(nuzlockeRun.id)).thenReturn(nuzlockeRun)

        val brokenCreator = CreateEncounterEventTO("", 0, 0, true, null)

        assertThrows<ValidationException> { controller.createEncounterEvent(nuzlockeRun.id, brokenCreator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(nuzlockeRun.id)
    }

    @Test
    fun createEncounterEvent_unauthorized() {
        whenever(principal.name).thenReturn("OtherUser")
        whenever(runsService.getRun(nuzlockeRun.id)).thenReturn(nuzlockeRun)

        assertThrows<UnauthorizedException> { controller.createEncounterEvent(nuzlockeRun.id, creatorOne, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(nuzlockeRun.id)
    }
}