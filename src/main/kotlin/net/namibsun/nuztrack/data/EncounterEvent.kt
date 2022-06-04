package net.namibsun.nuztrack.data

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "encounter")
class EncounterEvent(
        @Id @GeneratedValue
        val id: Long = 0,

        @ManyToOne(fetch = FetchType.LAZY, cascade = [CascadeType.PERSIST])
        @JoinColumn(name = "event_log_id", nullable = false)
        val eventLog: EventLog
)


@Repository
interface EncounterEventRepository : JpaRepository<EncounterEvent, Long> {
}

@Service
class EncounterEventService(val db: EncounterEventRepository) {

    fun create(eventLog: EventLog): Long {
        val encounterEvent = EncounterEvent(eventLog = eventLog)
        return db.save(encounterEvent).id
    }

}