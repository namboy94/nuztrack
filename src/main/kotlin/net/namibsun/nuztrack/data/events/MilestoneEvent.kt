package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NuzlockeRun
import org.springframework.stereotype.Service
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Table

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "milestone")
class MilestoneEvent(
        nuzlockeRun: NuzlockeRun,
        location: String,
        @Column val milestone: String
) : Event(nuzlockeRun = nuzlockeRun, location = location, eventType = EventType.MILESTONE)

@Service
class MilestoneEventService(val db: EventRepository) {
    fun getAllMilestoneEvents(): List<MilestoneEvent> {
        return db.findAllByEventTypeOrderByTimestamp(EventType.MILESTONE).map { it as MilestoneEvent }
    }

    fun createMilestoneEvent(nuzlockeRun: NuzlockeRun, location: String, milestone: String): MilestoneEvent {
        return db.save(MilestoneEvent(nuzlockeRun, location, milestone))
    }
}
