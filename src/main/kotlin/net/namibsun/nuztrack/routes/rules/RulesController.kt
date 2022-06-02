package net.namibsun.nuztrack.routes.rules

import net.namibsun.nuztrack.constants.Rules
import net.namibsun.nuztrack.constants.getDefaultRules
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
        val defaultRules = getDefaultRules().map { it.name.uppercase() }
        return ResponseEntity.ok(RulesDetailsTO(rules, defaultRules))
    }
}