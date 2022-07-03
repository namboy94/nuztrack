package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Rules
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.transfer.CreateNuzlockeRunTO
import net.namibsun.nuztrack.transfer.NuzlockeRunTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.security.Principal

@RestController
class RunsController(val service: NuzlockeRunService) {

    val authenticator = Authenticator(service)

    @GetMapping("/api/runs")
    @ResponseBody
    fun getRuns(principal: Principal): ResponseEntity<List<NuzlockeRunTO>> {
        val entities = this.service.getRuns(principal.name)
        val results = entities.map { NuzlockeRunTO.fromNuzlockeRun(it) }
        return ResponseEntity.ok(results)
    }

    @PostMapping("/api/runs")
    @ResponseBody
    fun createRun(@RequestBody createRun: CreateNuzlockeRunTO, principal: Principal): ResponseEntity<NuzlockeRunTO> {
        // TODO Add Trainer Information (OT and ID)
        createRun.validate()
        val game = Games.valueOfWithChecks(createRun.game)
        val rules = createRun.rules.map { Rules.valueOfWithChecks(it) }
        val run = this.service.createRun(principal.name, createRun.name, game, rules, createRun.customRules)
        return ResponseEntity<NuzlockeRunTO>(NuzlockeRunTO.fromNuzlockeRun(run), HttpStatus.CREATED)
    }

    @GetMapping("/api/runs/{id}")
    @ResponseBody
    fun getRun(@PathVariable id: Long, principal: Principal): ResponseEntity<NuzlockeRunTO> {
        val run = this.authenticator.loadAuthenticatedRun(id, principal.name)
        return ResponseEntity.ok(NuzlockeRunTO.fromNuzlockeRun(run))
    }

    @DeleteMapping("/api/runs/{id}")
    @ResponseBody
    fun deleteRun(@PathVariable id: Long, principal: Principal): ResponseEntity<Unit> {
        this.authenticator.loadAuthenticatedRun(id, principal.name)
        this.service.deleteRun(id)
        return ResponseEntity.ok(null)
    }

    @PostMapping("/api/runs/{id}/savefile")
    @ResponseBody
    fun uploadSavefile(@PathVariable id: Long, savefile: MultipartFile, principal: Principal): ResponseEntity<Unit> {
        val run = authenticator.loadAuthenticatedRun(id, principal.name)
        service.assignSavefile(run.id, savefile.bytes)
        return ResponseEntity.ok(null)
    }

    @PostMapping("/api/runs/{id}/savefile")
    @ResponseBody
    fun downloadSavefile(@PathVariable id: Long, principal: Principal): ResponseEntity<ByteArray> {
        val run = authenticator.loadAuthenticatedRun(id, principal.name)
        return ResponseEntity.ok(run.saveFile)
    }
}
