package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import org.springframework.stereotype.Service
import java.util.*
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "evolution")
class EvolutionEvent(
        nuzlockeRun: NuzlockeRun, location: String,

        @ManyToOne(fetch = FetchType.LAZY, cascade = [CascadeType.PERSIST])
        @JoinColumn(name = "team_member_id", nullable = false) var teamMember: TeamMember,

        @Column val level: Int, @Column val previousPokedexNumber: Int, @Column val newPokedexNumber: Int,

        id: Long = 0, timestamp: Date = Date()

) : Event(
        id = id, timestamp = timestamp, nuzlockeRun = nuzlockeRun, location = location, eventType = EventType.EVOLUTION
)

@Service
class EvolutionEventService(val db: EventRepository) {
    fun createEvolutionEvent(
            nuzlockeRun: NuzlockeRun, location: String, teamMember: TeamMember, level: Int, newPokedexNumber: Int,
            id: Long = 0, timestamp: Date = Date()
    ): EvolutionEvent {
        return db.save(
                EvolutionEvent(
                        nuzlockeRun, location, teamMember, level, teamMember.pokedexNumber, newPokedexNumber, id,
                        timestamp
                )
        )
    }
}
