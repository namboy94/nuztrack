package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.events.EncounterEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.*

class EncounterEventServiceTest {

    private val run = NuzlockeRunBuilder().build()
    private val repository: EventRepository = mock()
    private val service = EncounterEventService(repository)

    private val events = listOf(
            EncounterEventBuilder().id(1).location("Pallet Town").caught(true).isBulbasaur().nuzlockeRun(run).build(),
            EncounterEventBuilder().id(2).location("Route 1").caught(false).nuzlockeRun(run).build()
    )

    @BeforeEach
    fun setUp() {
        whenever(repository.save(any<EncounterEvent>())).thenAnswer { it.getArgument(0) }
        whenever(repository.findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.ENCOUNTER, run.id))
                .thenReturn(events)
    }

    @Test
    fun getAllEvents() {
        assertThat(service.getEncounterEvents(1)).isEqualTo(events)
        verify(repository, times(1)).findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.ENCOUNTER, run.id)
    }

    @Test
    fun createEncounterEvent() {
        val encounter = service.createEncounterEvent(run, "Pallet Town", 10, 50, false)

        assertThat(encounter.teamMember).isNull()
        assertThat(encounter.caught).isFalse
        assertThat(encounter.level).isEqualTo(50)
        verify(repository, times(1)).save(any<EncounterEvent>())
    }

    @Test
    fun getLocationsWithEncounters() {
        val locations = service.getLocationsWithEncounters(run.id)

        assertThat(locations).isEqualTo(events.map { it.location })
        verify(repository, times(1)).findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.ENCOUNTER, run.id)
    }

    @Test
    fun getEncounteredSpecies() {
        val caught = service.getEncounteredSpecies(run.id, true)
        val failedToCatch = service.getEncounteredSpecies(run.id, false)

        assertThat(caught).isEqualTo(events.filter { it.caught }.map { it.pokedexNumber })
        assertThat(failedToCatch).hasSameElementsAs(events.filter { !it.caught }.map { it.pokedexNumber })
        verify(repository, times(2)).findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.ENCOUNTER, run.id)
    }

    @Test
    fun getNicknamesOfCaughtEncounters() {
        val nicknames = service.getNicknamesOfCaughtEncounters(run.id)

        assertThat(nicknames).isEqualTo(events.filter { it.caught }.map { it.teamMember!!.nickname })
        verify(repository, times(1)).findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.ENCOUNTER, run.id)
    }
}
