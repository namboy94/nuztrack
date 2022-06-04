package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.EventType
import net.namibsun.nuztrack.constants.Gender
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "encounter")
class EncounterEvent(
        nuzlockeRun: NuzlockeRun,
        location: String,
        @Column val pokemonSpecies: Int,
        @Column val level: Int,
        @Column @Enumerated(EnumType.STRING) val gender: Gender,
        @Column val caught: Boolean,

        @OneToOne(cascade = [CascadeType.ALL])
        @JoinColumn(name = "encounter_id", nullable = true)
        val teamMember: TeamMember? = null

) : Event(nuzlockeRun = nuzlockeRun, location = location, eventType = EventType.ENCOUNTER)

class EncounterEventService(val db: EventRepository) {
    fun getAllEncounterEvents(): List<EncounterEvent> {
        return db.findAllByEventType(EventType.ENCOUNTER).map { it as EncounterEvent }
    }

    fun createSuccessfulEncounterEvent(
            nuzlockeRun: NuzlockeRun,
            location: String,
            pokemonSpecies: Int,
            level: Int,
            gender: Gender,
            caught: Boolean,
            teamMember: TeamMember?
    ): EncounterEvent {
        return db.save(EncounterEvent(nuzlockeRun, location, pokemonSpecies, level, gender, caught, teamMember))
    }
}