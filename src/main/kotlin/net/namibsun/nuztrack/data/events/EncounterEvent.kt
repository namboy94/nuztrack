package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.TeamMemberRepository
import org.springframework.stereotype.Service
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "encounter")
class EncounterEvent(
        nuzlockeRun: NuzlockeRun,
        location: String,
        @Column val pokedexNumber: Int,
        @Column val level: Int,
        @Column @Enumerated(EnumType.STRING) val gender: Gender,
        @Column val caught: Boolean,

        @OneToOne(mappedBy = "encounter", cascade = [CascadeType.ALL])
        val teamMember: TeamMember? = null

) : Event(nuzlockeRun = nuzlockeRun, location = location, eventType = EventType.ENCOUNTER)

@Service
class EncounterEventService(val db: EventRepository, val teamMemberRepository: TeamMemberRepository) {
    fun getAllEncounterEvents(): List<EncounterEvent> {
        return db.findAllByEventType(EventType.ENCOUNTER).map { it as EncounterEvent }
    }

    fun createEncounterEvent(
            nuzlockeRun: NuzlockeRun,
            location: String,
            pokedexNumber: Int,
            level: Int,
            gender: Gender,
            caught: Boolean
    ): EncounterEvent {
        return db.save(EncounterEvent(nuzlockeRun, location, pokedexNumber, level, gender, caught))
    }

    fun getLocationsWithEncounters(runId: Long): List<String> {
        return db.findAllByEventTypeAndNuzlockeRunId(EventType.ENCOUNTER, runId).map { it.location }
    }
}