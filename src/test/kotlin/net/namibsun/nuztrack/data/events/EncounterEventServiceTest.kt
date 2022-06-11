package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.data.ENCOUNTER
import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.TeamMemberRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.AdditionalAnswers
import org.mockito.kotlin.*

class EncounterEventServiceTest {
    private val repository: EventRepository = mock()
    private val teamMemberRepository: TeamMemberRepository = mock()
    private val service = EncounterEventService(repository)

    private val events = listOf<Event>(
            EncounterEvent(NUZLOCKE_RUN, "Pallet Town", 1, 1, false),
            EncounterEvent(NUZLOCKE_RUN, "Pokemon League", 2, 2, true)
    )

    @Test
    fun getAllEvents() {
        whenever(repository.findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.ENCOUNTER, 1)).thenReturn(events)
        assertThat(service.getEncounterEvents(1)).isEqualTo(events)
        verify(repository, times(1)).findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.ENCOUNTER, 1)
    }

    @Test
    fun createEncounterEvent() {
        whenever(repository.save(any<EncounterEvent>())).then(AdditionalAnswers.returnsFirstArg<EncounterEvent>())

        val encounter = service.createEncounterEvent(NUZLOCKE_RUN, "Pallet Town", 10, 50, false)

        assertThat(encounter.teamMember).isNull()
        assertThat(encounter.caught).isFalse
        assertThat(encounter.level).isEqualTo(50)
        verify(repository, times(1)).save(any<EncounterEvent>())
    }

    @Test
    fun getLocationsWithEncounters() {
        val runId = ENCOUNTER.nuzlockeRun.id
        whenever(repository.findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(
                EventType.ENCOUNTER, runId
        )).thenReturn(listOf(ENCOUNTER as Event))

        val locations = service.getLocationsWithEncounters(runId)

        assertThat(locations).isEqualTo(listOf(ENCOUNTER.location))
        verify(repository, times(1)).findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.ENCOUNTER, runId)
    }

    @Test
    fun getEncounteredSpecies() {
        val runId = ENCOUNTER.nuzlockeRun.id
        val one = EncounterEvent(NUZLOCKE_RUN, "A", 100, 1, true)
        val two = EncounterEvent(NUZLOCKE_RUN, "A", 200, 1, false)
        val three = EncounterEvent(NUZLOCKE_RUN, "A", 300, 1, false)
        whenever(repository.findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(
                EventType.ENCOUNTER, runId
        )).thenReturn(listOf(one, two, three))

        val caught = service.getEncounteredSpecies(runId, true)
        val failedToCatch = service.getEncounteredSpecies(runId, false)

        assertThat(caught).isEqualTo(listOf(100))
        assertThat(failedToCatch).hasSameElementsAs(listOf(200, 300))
        verify(repository, times(2)).findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.ENCOUNTER, runId)
    }

    @Test
    fun getNicknamesOfCaughtEncounters() {
        val runId = ENCOUNTER.nuzlockeRun.id
        val one = EncounterEvent(
                NUZLOCKE_RUN, "A", 100, 1, true,
                TeamMember(0, "AName", 1, 1, Gender.MALE, null, null, ENCOUNTER)
        )
        val two = EncounterEvent(
                NUZLOCKE_RUN, "B", 200, 1, true,
                TeamMember(0, "BName", 1, 1, Gender.MALE, null, null, ENCOUNTER))


        whenever(repository.findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(
                EventType.ENCOUNTER, runId
        )).thenReturn(listOf(one, two))

        val nicknames = service.getNicknamesOfCaughtEncounters(runId)

        assertThat(nicknames).isEqualTo(listOf("AName", "BName"))
        verify(repository, times(1)).findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.ENCOUNTER, runId)
    }
}
