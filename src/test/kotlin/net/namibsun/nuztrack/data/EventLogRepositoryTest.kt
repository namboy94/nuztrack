package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.constants.Games
import net.namibsun.nuztrack.constants.RunStatus
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager
import org.springframework.data.repository.findByIdOrNull


@DataJpaTest
class EventLogRepositoryTest {

    @Suppress("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    lateinit var entityManager: TestEntityManager

    @Autowired
    lateinit var repository: EventLogRepository

    @Autowired
    lateinit var nuzlockeRunRepository: NuzlockeRunRepository

    @Autowired
    lateinit var encounterEventRepository: EncounterEventRepository

    @Test
    fun createNewEventLog() {
        val run = NuzlockeRun(1, "A", "B", Games.RED, listOf(), listOf(), RunStatus.ACTIVE)
        nuzlockeRunRepository.save(run)
        repository.save(run.eventLog)

        entityManager.flush()

        val eventLog = repository.findByIdOrNull(run.eventLog.id)!!
        encounterEventRepository.save(EncounterEvent(eventLog = eventLog))
        encounterEventRepository.save(EncounterEvent(eventLog = eventLog))

        entityManager.flush()
        entityManager.refresh(eventLog)

        assertThat(eventLog.id).isNotEqualTo(0)
        assertThat(eventLog.encounters.size).isEqualTo(2)
    }
}