package net.namibsun.nuztrack.routes.rules

import net.namibsun.nuztrack.util.Rules
import net.namibsun.nuztrack.util.getDefaultRules
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

@RestController
class RulesController {

    @GetMapping("/rules")
    @ResponseBody
    fun getRules(): ResponseEntity<RulesDetailsTO> {
        val rules: Map<String, String> = Rules.values().associate { it.name.lowercase() to it.description }
        val defaultRules = getDefaultRules().map { it.name.lowercase() }
        return ResponseEntity.ok(RulesDetailsTO(rules, defaultRules))
    }
}