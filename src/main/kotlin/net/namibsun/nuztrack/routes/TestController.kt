package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.data.TestService
import net.namibsun.nuztrack.data.TestTable
import net.namibsun.nuztrack.model.NuzlockeRunInfo
import net.namibsun.nuztrack.model.TestTO
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@RestController
class TestController(val service: TestService) {

    @GetMapping("/api/test")
    @ResponseBody
    fun x(): ResponseEntity<TestTO> {

        val test = TestTable(service.find().size + 1)
        service.set(test)
        return ResponseEntity.ok(TestTO("A"));
    }

    @GetMapping("/api/count")
    @ResponseBody
    fun y() : ResponseEntity<Int> {
        return ResponseEntity.ok(service.find().size)
    }

    @GetMapping("/api/runs")
    @ResponseBody
    fun runs() : List<NuzlockeRunInfo> {
        return listOf(NuzlockeRunInfo("One", "Red"), NuzlockeRunInfo("Two", "Blue"))
    }

}