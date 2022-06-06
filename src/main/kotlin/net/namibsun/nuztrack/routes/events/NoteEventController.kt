package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.NoteEventService
import net.namibsun.nuztrack.transfer.events.CreateNoteEventTO
import net.namibsun.nuztrack.util.Authenticator
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
            @RequestBody creator: Any,
            principal: Principal
    ): ResponseEntity<CreateNoteEventTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)
        return ResponseEntity.ok(null)
    }

}