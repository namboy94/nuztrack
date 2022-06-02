package net.namibsun.nuztrack.routes.rules

import net.namibsun.nuztrack.constants.Rules
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

@RestController
class RulesController {

    @GetMapping("/api/rules")
    @ResponseBody
    fun getRules(): ResponseEntity<RulesDetailsTO> {
        val rules: Map<String, String> = Rules.values().associate { it.name.uppercase() to it.description }
        val defaultRules = Rules.defaultRules().map { it.name.uppercase() }
        return ResponseEntity.ok(RulesDetailsTO(rules, defaultRules))
    }
}