package net.namibsun.nuztrack.routes;

import TeamMemberBuilder
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

    @Test
    fun getMultiRunOptions() {
        val results = controller.getMultiRunOptions()
        assertThat(results.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(results.body).isEqualTo(MultiRunOptions.values().map { MultiRunOptionTO.fromOption(it) })
    }

    @Test
    fun createMultiRun_simple() {
        val existingRun = NuzlockeRunBuilder().build()
        val creator = CreateMultiRunTOBuilder()
                .runId(existingRun.id)
                .name("New Run")
                .game(Games.LEAFGREEN.name)
                .options(MultiRunOptions.values().map { it.name })
                .build()
        val newRun = NuzlockeRunBuilder().name(creator.name).game(Games.LEAFGREEN).id(2).build()
        val multiRun = MultiRunNuzlockeBuilder().runs(mutableListOf(existingRun, newRun)).build()

        val encounterOne = EncounterEventBuilder().caught(true).build()
        val teamMemberOne = TeamMemberBuilder().encounter(encounterOne).build()

        val encounterTwo = EncounterEventBuilder().caught(true).pokedexNumber(10).build()
        val teamMemberTwo = TeamMemberBuilder().encounter(encounterTwo).pokedexNumber(10).build()

        val encounterThree = EncounterEventBuilder().caught(true).pokedexNumber(25).build()
        val teamMemberThree = TeamMemberBuilder().encounter(encounterThree).pokedexNumber(25).build()
        val death = DeathEventBuilder().teamMember(teamMemberThree).build()

        val failedEncounter = EncounterEventBuilder().build()

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
}
