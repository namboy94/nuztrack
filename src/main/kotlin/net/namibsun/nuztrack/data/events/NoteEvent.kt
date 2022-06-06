package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NuzlockeRun
import org.springframework.stereotype.Service
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Table

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "note")
class NoteEvent(
        nuzlockeRun: NuzlockeRun,
        location: String,
        @Column val text: String
) : Event(nuzlockeRun = nuzlockeRun, location = location, eventType = EventType.NOTE)

@Service
class NoteEventService(val db: EventRepository) {
    fun createNoteEvent(nuzlockeRun: NuzlockeRun, location: String, text: String): NoteEvent {
        return db.save(NoteEvent(nuzlockeRun, location, text))
    }
}