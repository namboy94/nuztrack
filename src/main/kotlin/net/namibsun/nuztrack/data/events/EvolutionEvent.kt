package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import org.springframework.stereotype.Service
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "evolution")
class EvolutionEvent(
        nuzlockeRun: NuzlockeRun,
        location: String,

        @ManyToOne(fetch = FetchType.LAZY, cascade = [CascadeType.PERSIST])
        @JoinColumn(name = "team_member_id", nullable = false)
        val teamMember: TeamMember,

        @Column val level: Int,
        @Column val previousSpecies: Int,
        @Column val newSpecies: Int

) : Event(nuzlockeRun = nuzlockeRun, location = location, eventType = EventType.EVOLUTION)

@Service
class EvolutionEventService(val db: EventRepository) {
    fun getAllEvolutionEvents(): List<EvolutionEvent> {
        return db.findAllByEventType(EventType.EVOLUTION).map { it as EvolutionEvent }
    }

    fun createEvolutionEvent(
            nuzlockeRun: NuzlockeRun,
            location: String,
            teamMember: TeamMember,
            level: Int,
            previousSpecies: Int,
            newSpecies: Int
    ): EvolutionEvent {
        return db.save(EvolutionEvent(nuzlockeRun, location, teamMember, level, previousSpecies, newSpecies))
    }
}
