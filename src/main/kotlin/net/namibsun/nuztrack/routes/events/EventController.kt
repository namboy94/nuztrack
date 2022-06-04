package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.data.EncounterEventService
import net.namibsun.nuztrack.data.EventLogService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

@RestController
class EventController(val service: EventLogService, val other: EncounterEventService) {

    @GetMapping("/api/test1")
    @ResponseBody
    fun createEventLog(): ResponseEntity<Long> {
        return ResponseEntity.ok(service.create())
    }

    @GetMapping("/api/test2/{id}")
    @ResponseBody
    fun createEvent(@PathVariable id: Long): ResponseEntity<Long> {
        return ResponseEntity.ok(other.create(service.get(id)))
    }

    @GetMapping("/api/test3/{id}")
    @ResponseBody
    fun getEvent(@PathVariable id: Long): ResponseEntity<Int> {
        return ResponseEntity.ok(service.get(id).encounters.size)
    }

}