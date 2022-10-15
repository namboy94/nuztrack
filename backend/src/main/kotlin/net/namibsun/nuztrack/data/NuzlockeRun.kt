package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Rules
import net.namibsun.nuztrack.constants.enums.RunStatus
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.data.events.Event
import net.namibsun.nuztrack.data.events.EventRepository
import org.hibernate.annotations.Type
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "nuzlocke_run")
class NuzlockeRun(
        @Id @GeneratedValue val id: Long = 0, // TODO Outside of Constructor

        @Column val userName: String,

        @Column val name: String,

        @Column @Enumerated(EnumType.STRING) val game: Games,

        @ElementCollection @CollectionTable(name = "rules") @Enumerated(EnumType.STRING) val rules: List<Rules>,

        @ElementCollection @CollectionTable(name = "custom_rules") val customRules: List<String>,

        @Enumerated(EnumType.STRING) val status: RunStatus,

        @OneToMany(mappedBy = "nuzlockeRun", cascade = [CascadeType.ALL]) @OrderBy("timestamp")
        var events: MutableList<Event> = mutableListOf(),

        @ManyToOne(fetch = FetchType.LAZY, cascade = [CascadeType.PERSIST])
        @JoinColumn(name = "multi_run_nuzlocke_id", nullable = true) var multiRun: MultiRunNuzlocke? = null,

        @Column
        @Type(type = "org.hibernate.type.BinaryType")
        @Lob
        var saveFile: ByteArray? = null
)

@Repository
interface NuzlockeRunRepository : JpaRepository<NuzlockeRun, Long> {
    fun findByUserName(userName: String): List<NuzlockeRun>
}

@Service
class NuzlockeRunService(
        val db: NuzlockeRunRepository, val eventRepository: EventRepository,
        val teamMemberRepository: TeamMemberRepository
) {

    fun getRun(id: Long): NuzlockeRun? {
        return this.db.findByIdOrNull(id)
    }

    fun getRuns(userName: String): List<NuzlockeRun> {
        return db.findByUserName(userName)
    }

    fun createRun(
            userName: String, name: String, game: Games, rules: List<Rules>, customRules: List<String>
    ): NuzlockeRun {
        return db.save(
                NuzlockeRun(
                        userName = userName, name = name, game = game, rules = rules, customRules = customRules,
                        status = RunStatus.ACTIVE
                )
        )
    }

    fun deleteRun(id: Long) {
        val events = eventRepository.findAllByNuzlockeRunIdOrderByTimestamp(id)
        val (encounters, otherEvents) = events.partition { it.eventType == EventType.ENCOUNTER }
        otherEvents.map { eventRepository.delete(it) }
        encounters.map { it as EncounterEvent }.filter { it.teamMember != null }.map {
            teamMemberRepository.delete(it.teamMember!!)
        }
        encounters.map { eventRepository.delete(it) }
        db.deleteById(id)
    }

    fun assignSavefile(runId: Long, data: ByteArray): NuzlockeRun {
        val run = db.getReferenceById(runId)
        run.saveFile = data
        return db.save(run)
    }
}
