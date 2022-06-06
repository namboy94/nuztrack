package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.NoteEventService
import net.namibsun.nuztrack.transfer.events.CreateNoteEventTO
import net.namibsun.nuztrack.transfer.events.NoteEventTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class NoteEventController(val service: NoteEventService, runService: NuzlockeRunService) {

    val authenticator = Authenticator(runService)

    @PostMapping("/api/events/{runId}/notes")
    @ResponseBody
    fun createNoteEvent(
            @PathVariable runId: Long,
            @RequestBody creator: CreateNoteEventTO,
            principal: Principal
    ): ResponseEntity<NoteEventTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)
        creator.validate()
        val note = service.createNoteEvent(run, creator.location, creator.text)
        return ResponseEntity<NoteEventTO>(NoteEventTO.fromNoteEvent(note), HttpStatus.CREATED)
    }

}