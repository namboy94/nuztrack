package net.namibsun.nuztrack

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

@SpringBootTest(
        classes = [NuztrackApplication::class],
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
internal class NuztrackApplicationTest {

    @Autowired
    lateinit var restTemplate: TestRestTemplate

    @Test
    fun testStartup() {
        main(arrayOf())
        val result = restTemplate.getForEntity("/api/games", ResponseEntity::class.java)
        assertThat(result).isNotNull
        assertThat(result.statusCode).isEqualTo(HttpStatus.FOUND)
    }

}