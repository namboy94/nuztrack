package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.EventType
import net.namibsun.nuztrack.data.NuzlockeRun
import org.hibernate.annotations.CreationTimestamp
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import java.util.*
import javax.persistence.*


@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
class Event(
        @Column(nullable = false) @Id
        @GeneratedValue
        val id: Long = 0,

        @CreationTimestamp
        @Temporal(TemporalType.TIMESTAMP)
        @Column(name = "create_date")
        val timestamp: Date = Date(),

        @ManyToOne(fetch = FetchType.LAZY, cascade = [CascadeType.PERSIST])
        @JoinColumn(name = "nuzlocke_run_id", nullable = false)
        val nuzlockeRun: NuzlockeRun,

        @Column val location: String,
        @Column @Enumerated(EnumType.STRING) val eventType: EventType
)

@Repository
interface EventRepository : JpaRepository<Event, Long> {
    fun findAllByEventType(eventType: EventType): List<Event>
}

@Service
class EventService(val db: EventRepository) {
    fun getAllEvents(): List<Event> {
        return db.findAll()
    }
}