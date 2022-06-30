package net.namibsun.nuztrack.routes;

import TeamMemberBuilder
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.MultiRunOptions
import net.namibsun.nuztrack.data.MultiRunNuzlockeService
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.DeathEventService
import net.namibsun.nuztrack.data.events.EncounterEventService
import net.namibsun.nuztrack.testbuilders.DeathEventBuilder
import net.namibsun.nuztrack.testbuilders.EncounterEventBuilder
import net.namibsun.nuztrack.testbuilders.MultiRunNuzlockeBuilder
import net.namibsun.nuztrack.testbuilders.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.transfer.CreateMultiRunTOBuilder
import net.namibsun.nuztrack.transfer.MultiRunOptionTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.*
import org.springframework.http.HttpStatus
import java.security.Principal

internal class MultiRunControllerTest {

    private val principal: Principal = mock()
    private val service: MultiRunNuzlockeService = mock()
    private val runsService: NuzlockeRunService = mock()
    private val encounterService: EncounterEventService = mock()
    private val teamMemberService: TeamMemberService = mock()
    private val deathService: DeathEventService = mock()
    private val controller = MultiRunController(service, runsService, teamMemberService, encounterService, deathService)

    private val existingRun = NuzlockeRunBuilder().build()
    private val newRun = NuzlockeRunBuilder().name("New Run").game(Games.LEAFGREEN).id(2).build()
    private val multiRun = MultiRunNuzlockeBuilder().runs(mutableListOf(existingRun, newRun)).build()

    private val encounterOne = EncounterEventBuilder().caught(true).build()
    private val teamMemberOne = TeamMemberBuilder().encounter(encounterOne).build()

    private val encounterTwo = EncounterEventBuilder().caught(true).pokedexNumber(10).build()
    private val teamMemberTwo = TeamMemberBuilder().encounter(encounterTwo).pokedexNumber(10).build()

    private val encounterThree = EncounterEventBuilder().caught(true).pokedexNumber(25).build()
    private val teamMemberThree = TeamMemberBuilder().encounter(encounterThree).pokedexNumber(25).build()
    private val death = DeathEventBuilder().teamMember(teamMemberThree).build()

    private val failedEncounter = EncounterEventBuilder().build()

    private fun setUpMocks() {
        whenever(principal.name).thenReturn(existingRun.userName)
        whenever(runsService.getRun(existingRun.id)).thenReturn(existingRun)
        whenever(runsService.createRun(any(), any(), any(), any(), any())).thenReturn(newRun)
        whenever(encounterService.createEncounterEvent(any(), any(), any(), any(), any())).thenAnswer { args ->
            EncounterEventBuilder().location(args.getArgument(1)).pokedexNumber(args.getArgument(2)).build()
        }
        whenever(teamMemberService.createTeamMember(any(), any(), any(), any(), any())).thenAnswer { args ->
            TeamMemberBuilder().encounter(args.getArgument(0)).build()
        }
        whenever(deathService.createDeathEvent(any(), any(), any(), any(), any(), any())).thenAnswer { args ->
            DeathEventBuilder().teamMember(args.getArgument(2)).build()
        }
        whenever(teamMemberService.getTeam(existingRun.id)).thenReturn(Triple(
                listOf(teamMemberOne),
                listOf(teamMemberTwo),
                listOf(teamMemberThree)
        ))
        whenever(encounterService.getEncounterEvents(existingRun.id)).thenReturn(listOf(
                encounterOne, encounterTwo, encounterThree, failedEncounter
        ))
        whenever(service.linkRuns(existingRun, newRun)).thenReturn(multiRun)
    }

    @Test
    fun getMultiRunOptions() {
        val results = controller.getMultiRunOptions()
        assertThat(results.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(results.body).isEqualTo(MultiRunOptions.values().map { MultiRunOptionTO.fromOption(it) })
    }

    @Test
    fun createMultiRun_allOptions() {
        setUpMocks()
        val creator = CreateMultiRunTOBuilder()
                .runId(existingRun.id)
                .name(newRun.name)
                .game(newRun.game.name)
                .options(MultiRunOptions.values().map { it.name })
                .build()
        val result = controller.createMultiRun(creator, principal)
        val newRunResult = result.body!!

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(newRunResult.name).isEqualTo(newRun.name)

        verify(runsService, times(1)).createRun(
                newRun.userName, newRun.name, newRun.game, newRun.rules, newRun.customRules
        )
        verify(service, times(1)).linkRuns(existingRun, newRun)
        verify(encounterService, times(3)).createEncounterEvent(
                eq(newRun), eq("Previous Game"), any(), any(), eq(true)
        )
        verify(encounterService, times(1)).createEncounterEvent(
                eq(newRun), eq("Previous Game"), any(), any(), eq(false)
        )
        verify(teamMemberService, times(3)).createTeamMember(any(), any(), any(), any(), any())
        verify(deathService, times(1)).createDeathEvent(
                eq(newRun), eq("Previous Game"), any(), eq(death.level), eq(death.opponent), eq(death.description)
        )
    }

    @Test
    fun createMultiRun_noOptions() {
        setUpMocks()
        val creator = CreateMultiRunTOBuilder()
                .runId(existingRun.id)
                .name(newRun.name)
                .game(newRun.game.name)
                .options(listOf())
                .build()
        val result = controller.createMultiRun(creator, principal)
        val newRunResult = result.body!!

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(newRunResult.name).isEqualTo(newRun.name)

        verify(runsService, times(1)).createRun(
                newRun.userName, newRun.name, newRun.game, newRun.rules, newRun.customRules
        )
        verify(service, times(1)).linkRuns(existingRun, newRun)
        verify(encounterService, times(0)).createEncounterEvent(any(), any(), any(), any(), any())
        verify(encounterService, times(0)).createEncounterEvent(any(), any(), any(), any(), any())
        verify(teamMemberService, times(0)).createTeamMember(any(), any(), any(), any(), any())
        verify(deathService, times(0)).createDeathEvent(any(), any(), any(), any(), any(), any())
    }

    @Test
    fun createMultiRun_invalidCreator() {
        setUpMocks()
        val creator = CreateMultiRunTOBuilder()
                .runId(existingRun.id)
                .name(newRun.name)
                .game(Games.RED.name)
                .options(listOf())
                .build()

        assertThat(assertThrows<ValidationException> { controller.createMultiRun(creator, principal) }.message)
                .isEqualTo(ErrorMessages.MULTI_RUN_BACKWARDS.message)
        verify(runsService, times(0)).createRun(any(), any(), any(), any(), any())
    }
}
