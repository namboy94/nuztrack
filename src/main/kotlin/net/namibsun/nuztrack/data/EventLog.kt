package net.namibsun.nuztrack.data

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "event_log")
class EventLog(
        @Id @GeneratedValue
        val id: Long = 0,

        @OneToOne(mappedBy = "eventLog")
        val run: NuzlockeRun,

        @OneToMany(mappedBy = "eventLog", cascade = [CascadeType.ALL])
        val encounters: List<EncounterEvent> = listOf()
)

@Repository
interface EventLogRepository : JpaRepository<EventLog, Long> {
}

@Service
class EventLogService(val db: EventLogRepository) {

    fun create(): Long {
        return 0
//        return db.save(EventLog()).id
    }

    fun get(id: Long): EventLog {
        return db.findById(id).get()
    }

}