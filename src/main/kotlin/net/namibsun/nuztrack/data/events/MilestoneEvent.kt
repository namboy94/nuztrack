package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NuzlockeRun
import org.springframework.stereotype.Service
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Table

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "milestone")
class MilestoneEvent(
        nuzlockeRun: NuzlockeRun,
        location: String,
        @Column val milestone: String,

        id: Long = 0,
        timestamp: Date = Date()
) : Event(id = id, timestamp = timestamp, nuzlockeRun = nuzlockeRun, location = location, eventType = EventType.MILESTONE)

@Service
class MilestoneEventService(val db: EventRepository) {
    fun getMilestoneEvents(runId: Long): List<MilestoneEvent> {
        return db.findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.MILESTONE, runId).map {
            it as MilestoneEvent
        }
    }

    fun createMilestoneEvent(
            nuzlockeRun: NuzlockeRun,
            location: String,
            milestone: String,
            id: Long = 0,
            timestamp: Date = Date()
    ): MilestoneEvent {
        return db.save(MilestoneEvent(nuzlockeRun, location, milestone, id, timestamp))
    }
}
