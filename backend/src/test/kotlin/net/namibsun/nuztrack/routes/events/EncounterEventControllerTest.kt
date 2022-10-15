package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Rules
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.EncounterEventService
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEventService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.testbuilders.model.events.EncounterEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
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
    private val controller =
            EncounterEventController(service, teamMemberService, teamMemberSwitchEventService, runsService)

    private val run = NuzlockeRunBuilder().rules(
            listOf(
                    Rules.ONLY_FIRST_ENCOUNTER, Rules.DUPLICATE_CLAUSE,
                    Rules.DUPLICATE_CLAUSE_INCLUDES_FAILED_ENCOUNTERS, Rules.DUPLICATE_CLAUSE_INCLUDES_ENTIRE_SPECIES
            )
    ).build()

    private val encounterOneBuilder = EncounterEventBuilder().id(1).nuzlockeRun(run).caught(true)
    private val encounterOne = encounterOneBuilder.build()
    private val teamMember = TeamMemberBuilder().encounter(encounterOne).build()
    private val encounterOneCreator = encounterOneBuilder.teamMember(teamMember).buildCreatorTO()

    private val encounterTwoBuilder = EncounterEventBuilder().id(2).nuzlockeRun(run).caught(false)
    private val encounterTwo = encounterTwoBuilder.build()
    private val encounterTwoCreator = encounterTwoBuilder.buildCreatorTO()

    @BeforeEach
    fun setUp() {
        whenever(principal.name).thenReturn(run.userName)
        whenever(runsService.getRun(run.id)).thenReturn(run)
    }

    @Test
    fun createEncounterEvent_successfulCapture() {
        whenever(
                service.createEncounterEvent(
                        eq(run), eq(encounterOne.location), eq(encounterOne.pokedexNumber), eq(encounterOne.level),
                        eq(true), any(), any()
                )
        ).thenReturn(encounterOne)
        whenever(
                teamMemberService.createTeamMember(
                        encounterOne, teamMember.nickname, teamMember.gender, teamMember.nature, teamMember.abilitySlot
                )
        ).thenReturn(teamMember)
        whenever(service.getLocationsWithEncounters(run.id)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(run.id, true)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(run.id, false)).thenReturn(listOf())
        whenever(teamMemberService.getTeam(run.id)).thenReturn(Triple(listOf(), listOf(), listOf()))

        val result = controller.createEncounterEvent(run.id, encounterOneCreator, principal)

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(result.body!!.caught).isEqualTo(true)
        assertThat(result.body!!.teamMemberId).isNotNull

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(any())
        verify(service, times(1)).createEncounterEvent(any(), any(), any(), any(), any(), any(), any())
        verify(teamMemberService, times(1)).createTeamMember(any(), any(), any(), any(), any())
        verify(service, times(1)).getLocationsWithEncounters(run.id)
        verify(service, times(1)).getEncounteredSpecies(run.id, true)
        verify(service, times(1)).getEncounteredSpecies(run.id, false)
        verify(teamMemberService, times(1)).getTeam(run.id)
    }

    @Test
    fun createEncounterEvent_successfulCaptureWithOldGame() {
        val oldRun = NuzlockeRunBuilder().game(Games.RED).id(2).build()
        val member = TeamMemberBuilder().isBulbasaur().setGame(oldRun.game).build()
        val builder = EncounterEventBuilder().nuzlockeRun(oldRun).caught(true).teamMember(member)
        val encounter = builder.build()
        val creator = builder.buildCreatorTO()

        whenever(principal.name).thenReturn(oldRun.userName)
        whenever(runsService.getRun(oldRun.id)).thenReturn(oldRun)
        whenever(service.getLocationsWithEncounters(oldRun.id)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(oldRun.id, true)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(oldRun.id, false)).thenReturn(listOf())
        whenever(service.createEncounterEvent(any(), any(), any(), any(), any(), any(), any())).thenReturn(
                encounter
        )
        whenever(teamMemberService.createTeamMember(any(), any(), any(), any(), any())).thenReturn(member)
        whenever(teamMemberService.getTeam(oldRun.id)).thenReturn(Triple(listOf(), listOf(), listOf()))

        assertDoesNotThrow {
            val result = controller.createEncounterEvent(oldRun.id, creator, principal)
            assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        }

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(any())
        verify(service, times(1)).createEncounterEvent(any(), any(), any(), any(), any(), any(), any())
        verify(teamMemberService, times(1)).createTeamMember(
                encounter, creator.pokemon!!.nickname, null, null, null
        )
        verify(teamMemberService, times(1)).getTeam(oldRun.id)
    }

    @Test
    fun createEncounterEvent_failedCapture() {
        whenever(
                service.createEncounterEvent(
                        eq(run), eq(encounterTwo.location), eq(encounterTwo.pokedexNumber), eq(encounterTwo.level),
                        eq(false), any(), any()
                )
        ).thenReturn(encounterTwo)
        whenever(service.getLocationsWithEncounters(run.id)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(run.id, true)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(run.id, false)).thenReturn(listOf())

        val result = controller.createEncounterEvent(run.id, encounterTwoCreator, principal)

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(result.body!!.caught).isEqualTo(false)
        assertThat(result.body!!.teamMemberId).isNull()

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(any())
        verify(service, times(1)).createEncounterEvent(any(), any(), any(), any(), any(), any(), any())
        verify(teamMemberService, times(0)).createTeamMember(any(), any(), any(), any(), any())
        verify(service, times(1)).getLocationsWithEncounters(run.id)
        verify(service, times(1)).getEncounteredSpecies(run.id, true)
        verify(service, times(1)).getEncounteredSpecies(run.id, false)
    }

    @Test
    fun createEncounterEvent_validationError() {
        val brokenCreator = EncounterEventBuilder().location("").buildCreatorTO()

        assertThrows<ValidationException> { controller.createEncounterEvent(run.id, brokenCreator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }

    @Test
    fun createEncounterEvent_unauthorized() {
        whenever(principal.name).thenReturn("OtherUser")
        whenever(runsService.getRun(run.id)).thenReturn(run)

        assertThrows<UnauthorizedException> { controller.createEncounterEvent(run.id, encounterOneCreator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
        verify(service, times(0)).createEncounterEvent(any(), any(), any(), any(), any(), any(), any())
    }
}