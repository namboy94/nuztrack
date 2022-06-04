package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.EventType
import net.namibsun.nuztrack.constants.Gender
import net.namibsun.nuztrack.constants.Natures
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
    fun createFailedEncounterEvent() {
        whenever(repository.save(any<EncounterEvent>())).then(AdditionalAnswers.returnsFirstArg<EncounterEvent>())
        whenever(teamMemberRepository.save(any<TeamMember>())).then(AdditionalAnswers.returnsFirstArg<TeamMember>())

        val encounter = service.createFailedEncounterEvent(NUZLOCKE_RUN, "Pallet Town", 10, 50, Gender.FEMALE)

        assertThat(encounter.teamMember).isNull()
        assertThat(encounter.caught).isFalse
        assertThat(encounter.level).isEqualTo(50)
        verify(repository, times(1)).save(any<EncounterEvent>())
        verify(teamMemberRepository, times(0)).save(any<TeamMember>())
    }

    @Test
    fun createSuccessfulEncounterEvent() {
        whenever(repository.save(any<EncounterEvent>())).then(AdditionalAnswers.returnsFirstArg<EncounterEvent>())
        whenever(teamMemberRepository.save(any<TeamMember>())).then(AdditionalAnswers.returnsFirstArg<TeamMember>())

        val encounter = service.createSuccessfulEncounterEvent(
                NUZLOCKE_RUN, "Pallet Town", 10, 50, Gender.FEMALE,
                "Poli", Natures.BRAVE, 2
        )

        assertThat(encounter.caught).isTrue
        assertThat(encounter.level).isEqualTo(50)
        verify(repository, times(1)).save(any<EncounterEvent>())
        verify(teamMemberRepository, times(1)).save(any<TeamMember>())
    }
}
