package net.namibsun.nuztrack.routes.runs

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.NuzlockeRunService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.HttpClientErrorException
import java.security.Principal

@RestController
class RunsController(val service: NuzlockeRunService) {

    @GetMapping("/api/runs")
    @ResponseBody
    fun getRuns(principal: Principal): ResponseEntity<List<NuzlockeRunTO>> {
        val entities = this.service.getRuns(principal.name)
        val results = entities.map { convertNuzlockeRunToNuzlockeRunTO(it) }
        return ResponseEntity.ok(results)
    }

    @PostMapping("/api/runs")
    @ResponseBody
    fun createRun(@RequestBody createRun: CreateNuzlockeRunTO, principal: Principal): ResponseEntity<NuzlockeRunTO> {
        val run = convertCreateNuzlockeRunTOToNuzlockeRun(createRun, principal.name)
        this.service.createRun(run)
        return ResponseEntity.ok(convertNuzlockeRunToNuzlockeRunTO(run))
    }

    @GetMapping("/api/runs/{id}")
    @ResponseBody
    fun getRun(@PathVariable id: Long, principal: Principal): ResponseEntity<NuzlockeRunTO> {
        val run = this.fetchRun(id, principal.name)
        return ResponseEntity.ok(convertNuzlockeRunToNuzlockeRunTO(run))
    }

    @DeleteMapping("/api/runs/{id}")
    @ResponseBody
    fun deleteRun(@PathVariable id: Long, principal: Principal): ResponseEntity<Unit> {
        val run = this.fetchRun(id, principal.name)
        this.service.deleteRun(run)
        return ResponseEntity.ok(null)
    }

    private fun fetchRun(runId: Long, user: String): NuzlockeRun {
        val run = this.service.getRun(runId) ?: throw HttpClientErrorException(HttpStatus.NOT_FOUND)
        if (run.userName != user) {
            throw HttpClientErrorException(HttpStatus.UNAUTHORIZED)
        }
        return run
    }

}
