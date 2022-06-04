package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.constants.enums.Natures
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
        @Column val pokemonSpecies: Int,
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

    fun createFailedEncounterEvent(
            nuzlockeRun: NuzlockeRun,
            location: String,
            pokemonSpecies: Int,
            level: Int,
            gender: Gender
    ): EncounterEvent {
        return db.save(EncounterEvent(nuzlockeRun, location, pokemonSpecies, level, gender, false))
    }

    fun createSuccessfulEncounterEvent(
            nuzlockeRun: NuzlockeRun,
            location: String,
            pokemonSpecies: Int,
            level: Int,
            gender: Gender,
            nickname: String,
            nature: Natures,
            abilitySlot: Int
    ): EncounterEvent {
        val encounter = db.save(EncounterEvent(nuzlockeRun, location, pokemonSpecies, level, gender, true))
        val teamMember = teamMemberRepository.save(TeamMember(
                nickname = nickname,
                species = pokemonSpecies,
                abilitySlot = abilitySlot,
                level = level,
                nature = nature,
                encounter = encounter
        ))
        return teamMember.encounter
    }

    fun getLocationsWithEncounters(runId: Long): List<String> {
        return db.findAllByEventTypeAndNuzlockeRunId(EventType.ENCOUNTER, runId).map { it.location }
    }
}