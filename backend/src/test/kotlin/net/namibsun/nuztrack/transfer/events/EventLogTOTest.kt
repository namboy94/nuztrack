package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.data.events.*
import net.namibsun.nuztrack.testbuilders.model.events.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test


internal class EventLogTOTest {

    @Test
    fun fromEvents() {
        val events = listOf(
                EncounterEventBuilder().build(),
                EvolutionEventBuilder().build(),
                DeathEventBuilder().build(),
                TeamMemberSwitchEventBuilder().build(),
                MilestoneEventBuilder().build(),
                NoteEventBuilder().build()
        )
        val converted = EventLogTO.fromEvents(events)
        assertThat(converted.encounters).isEqualTo(
                listOf(EncounterEventTO.fromEncounterEvent(events[0] as EncounterEvent))
        )
        assertThat(converted.evolutions).isEqualTo(
                listOf(EvolutionEventTO.fromEvolutionEvent(events[1] as EvolutionEvent))
        )
        assertThat(converted.deaths).isEqualTo(
                listOf(DeathEventTO.fromDeathEvent(events[2] as DeathEvent))
        )
        assertThat(converted.teamMemberSwitches).isEqualTo(
                listOf(TeamMemberSwitchEventTO.fromTeamMemberSwitchEvent(events[3] as TeamMemberSwitchEvent))
        )
        assertThat(converted.milestones).isEqualTo(
                listOf(MilestoneEventTO.fromMilestoneEvent(events[4] as MilestoneEvent))
        )
        assertThat(converted.notes).isEqualTo(
                listOf(NoteEventTO.fromNoteEvent(events[5] as NoteEvent))
        )
    }
}
