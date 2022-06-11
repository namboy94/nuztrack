package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.enums.*
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.events.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.security.Principal

class EventControllerTest {

    private val principal: Principal = mock()
    private val runsService: NuzlockeRunService = mock()
    private val service: EventService = mock()
    private val controller = EventController(service, runsService)

    private val user = "Ash"
    private val nuzlockeRun = NuzlockeRun(
            5, user, "First", Games.RED, listOf(Rules.ONLY_FIRST_ENCOUNTER), listOf(), RunStatus.COMPLETED
    )
    private val encounterOne = EncounterEvent(nuzlockeRun, "Pallet Town", 7, 5, true)
    private val encounterTwo = EncounterEvent(nuzlockeRun, "Viridian Forrest", 10, 3, false)
    private val teamMember = TeamMember(0, "Nick", 8, 28, Gender.MALE, Natures.BOLD, 1, encounterOne)
    private val evolution = EvolutionEvent(nuzlockeRun, "Cerulean City", teamMember, 16, 7, 8)
    private val death = DeathEvent(nuzlockeRun, "Vermillion City", teamMember, 28, "Lt. Surge", "Zapped")
    private val switchOne = TeamMemberSwitchEvent(nuzlockeRun, "Route 1", teamMember, TeamMemberSwitchType.REMOVE)
    private val switchTwo = TeamMemberSwitchEvent(nuzlockeRun, "Route 2", teamMember, TeamMemberSwitchType.ADD)
    private val noteOne = NoteEvent(nuzlockeRun, "Pallet Town", "Start")
    private val noteTwo = NoteEvent(nuzlockeRun, "Vermillion City", "NOOOOOOO!!!!")
    private val milestone = MilestoneEvent(nuzlockeRun, "Pewter City", "Boulder Badge")

    @Test
    fun getEvents() {
        val events = listOf(
                encounterOne, encounterTwo, evolution, death,
                switchOne, switchTwo, noteOne, noteTwo, milestone
        )
        whenever(runsService.getRun(nuzlockeRun.id)).thenReturn(nuzlockeRun)
        whenever(service.getAllEvents(nuzlockeRun.id)).thenReturn(events)
        whenever(principal.name).thenReturn(user)

        val result = controller.getEvents(nuzlockeRun.id, principal).body!!

        assertThat(result.encounters.size).isEqualTo(2)
        assertThat(result.deaths.size).isEqualTo(1)
        assertThat(result.evolutions.size).isEqualTo(1)
        assertThat(result.teamMemberSwitches.size).isEqualTo(2)
        assertThat(result.notes.size).isEqualTo(2)
        assertThat(result.milestones.size).isEqualTo(1)

        verify(service, times(1)).getAllEvents(nuzlockeRun.id)
        verify(principal, times(1)).name
    }

    @Test
    fun getEvents_unauthorized() {
        whenever(principal.name).thenReturn("OtherUser")
        whenever(runsService.getRun(nuzlockeRun.id)).thenReturn(nuzlockeRun)

        assertThrows<UnauthorizedException> { controller.getEvents(nuzlockeRun.id, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(nuzlockeRun.id)
    }
}