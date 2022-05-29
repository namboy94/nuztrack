package net.namibsun.nuztrack.routes.runs

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.util.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
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
        val game = getValueOfGameTitle(createRun.game)
        val rules = createRun.rules.map { getValueOfRuleKey(it) }
        val run = this.service.createRun(principal.name, createRun.name, game, rules)
        return ResponseEntity.ok(convertNuzlockeRunToNuzlockeRunTO(run))
    }

    @GetMapping("/api/runs/{id}")
    @ResponseBody
    fun getRun(@PathVariable id: Long, principal: Principal): ResponseEntity<NuzlockeRunTO> {
        print("HELLO WORLD")
        val run = this.authorizeAccess(id, principal.name)
        return ResponseEntity.ok(convertNuzlockeRunToNuzlockeRunTO(run))
    }

    @DeleteMapping("/api/runs/{id}")
    @ResponseBody
    fun deleteRun(@PathVariable id: Long, principal: Principal): ResponseEntity<Unit> {
        this.authorizeAccess(id, principal.name)
        this.service.deleteRun(id)
        return ResponseEntity.ok(null)
    }

    private fun authorizeAccess(runId: Long, user: String): NuzlockeRun {
        val run = this.service.getRun(runId) ?: throw NotFoundException(ErrorMessages.RUN_NOT_FOUND)
        if (run.userName != user) {
            throw UnauthorizedException(ErrorMessages.NO_ACCESS_TO_RUN)
        }
        return run
    }
}
