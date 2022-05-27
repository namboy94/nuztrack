package net.namibsun.nuztrack.routes.runs

import net.namibsun.nuztrack.data.NuzlockeRunService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class RunsController(val service: NuzlockeRunService) {

    @GetMapping("/api/runs")
    @ResponseBody
    fun getRuns(principal: Principal): ResponseEntity<List<NuzlockeRunBasicInfoTO>> {
        val results = this.service.getRuns(principal.name).map {
            NuzlockeRunBasicInfoTO(it.id, it.userName, it.name, it.game.name)
        }
        return ResponseEntity.ok(results)
    }

    @PostMapping("/api/runs")
    @ResponseBody
    fun createRun(@RequestBody nuzlockeRun: CreateNuzlockeRunTO, principal: Principal): ResponseEntity<Unit> {
        this.service.createRun(nuzlockeRun, principal.name)
        return ResponseEntity.ok(null)
    }
}
