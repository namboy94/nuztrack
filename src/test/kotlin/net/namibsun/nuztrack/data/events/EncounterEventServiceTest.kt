package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.data.ENCOUNTER
import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import net.namibsun.nuztrack.data.TeamMemberRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.AdditionalAnswers
import org.mockito.kotlin.*

class EncounterEventServiceTest {
    private val repository: EventRepository = mock()
    private val teamMemberRepository: TeamMemberRepository = mock()
    private val service = EncounterEventService(repository, teamMemberRepository)

    private val events = listOf<Event>(
            EncounterEvent(NUZLOCKE_RUN, "Pallet Town", 1, 1, Gender.MALE, false),
            EncounterEvent(NUZLOCKE_RUN, "Pokemon League", 2, 2, Gender.FEMALE, true)
    )

    @Test
    fun getAllEvents() {
        whenever(repository.findAllByEventType(EventType.ENCOUNTER)).thenReturn(events)
        assertThat(service.getAllEncounterEvents()).isEqualTo(events)
        verify(repository, times(1)).findAllByEventType(EventType.ENCOUNTER)
    }

    @Test
    fun createEncounterEvent() {
        whenever(repository.save(any<EncounterEvent>())).then(AdditionalAnswers.returnsFirstArg<EncounterEvent>())

        val encounter = service.createEncounterEvent(NUZLOCKE_RUN, "Pallet Town", 10, 50, Gender.FEMALE, false)

        assertThat(encounter.teamMember).isNull()
        assertThat(encounter.caught).isFalse
        assertThat(encounter.level).isEqualTo(50)
        verify(repository, times(1)).save(any<EncounterEvent>())
    }

    @Test
    fun getLocationsForRun() {
        val runId = ENCOUNTER.nuzlockeRun.id
        whenever(repository.findAllByEventTypeAndNuzlockeRunId(
                EventType.ENCOUNTER, runId
        )).thenReturn(listOf(ENCOUNTER as Event))

        val locations = service.getLocationsWithEncounters(runId)

        assertThat(locations).isEqualTo(listOf(ENCOUNTER.location))
        verify(repository, times(1)).findAllByEventTypeAndNuzlockeRunId(EventType.ENCOUNTER, runId)
    }
}