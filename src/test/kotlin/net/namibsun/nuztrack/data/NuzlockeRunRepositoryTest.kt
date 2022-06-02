package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.constants.Games
import net.namibsun.nuztrack.constants.RunStatus
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest

@DataJpaTest
class NuzlockeRunRepositoryTest {

    @Autowired
    lateinit var repository: NuzlockeRunRepository

    @Test
    fun findByUserName_success() {
        repository.save(NuzlockeRun(
                null,
                "Ash",
                "First",
                Games.RED,
                listOf(),
                listOf(),
                RunStatus.ACTIVE
        ))
        val found = repository.findByUserName("Ash")
        assertThat(found).hasSize(1)
        assertThat(found[0].userName).isEqualTo("Ash")
    }

    @Test
    fun findByUserName_noResults() {
        repository.save(NuzlockeRun(
                null,
                "Ash",
                "First",
                Games.RED,
                listOf(),
                listOf(),
                RunStatus.ACTIVE
        ))
        val found = repository.findByUserName("Gary")
        assertThat(found).hasSize(0)
    }
}