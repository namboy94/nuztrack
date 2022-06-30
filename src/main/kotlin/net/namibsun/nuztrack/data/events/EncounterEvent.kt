package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
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
        @Column val caught: Boolean,

        @OneToOne(mappedBy = "encounter", cascade = [CascadeType.ALL])
        var teamMember: TeamMember? = null

) : Event(nuzlockeRun = nuzlockeRun, location = location, eventType = EventType.ENCOUNTER)

@Service
class EncounterEventService(val db: EventRepository) {
    fun getEncounterEvents(runId: Long): List<EncounterEvent> {
        return db.findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.ENCOUNTER, runId).map { it as EncounterEvent }
    }

    fun createEncounterEvent(
            nuzlockeRun: NuzlockeRun,
            location: String,
            pokedexNumber: Int,
            level: Int,
            caught: Boolean
    ): EncounterEvent {
        return db.save(EncounterEvent(nuzlockeRun, location, pokedexNumber, level, caught))
    }

    fun getLocationsWithEncounters(runId: Long): List<String> {
        return getEncounterEvents(runId).map { it.location }
    }

    fun getNicknamesOfCaughtEncounters(runId: Long): List<String> {
        return getEncounterEvents(runId).filter { it.teamMember != null }.map { it.teamMember!!.nickname }
    }

    fun getEncounteredSpecies(runId: Long, caught: Boolean): List<Int> {
        return getEncounterEvents(runId).filter { it.caught == caught }.map { it.pokedexNumber }
    }
}