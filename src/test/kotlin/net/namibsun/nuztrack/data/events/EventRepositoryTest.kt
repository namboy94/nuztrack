package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import net.namibsun.nuztrack.data.NuzlockeRunRepository
import net.namibsun.nuztrack.data.TeamMemberRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.transaction.TestTransaction


@DataJpaTest
class EventRepositoryTest {

    @Autowired
    lateinit var repository: EventRepository

    @Autowired
    lateinit var runRepository: NuzlockeRunRepository

    @Autowired
    lateinit var eventRepository: EventRepository

    @Autowired
    lateinit var teamMemberRepository: TeamMemberRepository

    @Test
    fun findAllByEventType() {
        val run = runRepository.save(NUZLOCKE_RUN)

        repository.save(NoteEvent(run, "A", "Hello World"))
        repository.save(MilestoneEvent(run, "B", "Badge 1"))
        repository.saveAndFlush(MilestoneEvent(run, "C", "Badge 2"))

        assertThat(repository.findAllByEventType(EventType.EVOLUTION).size).isEqualTo(0)
        assertThat(repository.findAllByEventType(EventType.NOTE).size).isEqualTo(1)
        assertThat(repository.findAllByEventType(EventType.MILESTONE).size).isEqualTo(2)
        assertThat((repository.findAllByEventType(EventType.NOTE)[0] as NoteEvent).text).isEqualTo("Hello World")
    }

    @Test
    @DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
    fun eventsAccessibleByRun() {
        val run = runRepository.save(NUZLOCKE_RUN)
        eventRepository.save(NoteEvent(run, "A", "A"))

        TestTransaction.flagForCommit()
        TestTransaction.end()
        TestTransaction.start()

        assertThat(runRepository.getReferenceById(run.id).events.size).isEqualTo(1)
        assertThat(eventRepository.findAll()[0].nuzlockeRun.id).isEqualTo(run.id)
    }


    @Test
    fun timestampGeneration() {
        val run = runRepository.save(NUZLOCKE_RUN)
        val one = repository.save(NoteEvent(run, "A", "A"))
        Thread.sleep(1000)
        val two = repository.save(NoteEvent(run, "B", "B"))
        val three = repository.save(NoteEvent(run, "C", "C"))

        val deltaOne = two.timestamp.time - one.timestamp.time
        val deltaTwo = three.timestamp.time - two.timestamp.time
        assertThat(deltaOne).isGreaterThanOrEqualTo(1000)
        assertThat(deltaTwo).isLessThan(1000)
    }
}