package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest

@DataJpaTest
class NuzlockeRunRepositoryTest {

    @Autowired
    lateinit var repository: NuzlockeRunRepository

    private val run = NuzlockeRunBuilder().build()

    @Test
    fun findByUserName_success() {
        repository.save(run)
        val found = repository.findByUserName(run.userName)
        assertThat(found).hasSize(1)
        assertThat(found[0].userName).isEqualTo(run.userName)
    }

    @Test
    fun findByUserName_noResults() {
        repository.save(run)
        val found = repository.findByUserName("Gary")
        assertThat(found).hasSize(0)
    }
}