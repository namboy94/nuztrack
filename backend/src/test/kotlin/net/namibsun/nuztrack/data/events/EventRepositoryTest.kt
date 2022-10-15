package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NuzlockeRunRepository
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.events.MilestoneEventBuilder
import net.namibsun.nuztrack.testbuilders.model.events.NoteEventBuilder
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

    @Test
    fun findAllByEventType() {
        val run = runRepository.save(NuzlockeRunBuilder().build())

        val note = repository.save(NoteEventBuilder().nuzlockeRun(run).build())
        val milestone = repository.save(MilestoneEventBuilder().nuzlockeRun(run).build())
        repository.saveAndFlush(MilestoneEventBuilder().nuzlockeRun(run).build())

        assertThat(repository.findAllByEventTypeOrderByTimestamp(EventType.EVOLUTION).size).isEqualTo(0)
        assertThat(repository.findAllByEventTypeOrderByTimestamp(EventType.NOTE).size).isEqualTo(1)
        assertThat(repository.findAllByEventTypeOrderByTimestamp(EventType.MILESTONE).size).isEqualTo(2)
        assertThat((repository.findAllByEventTypeOrderByTimestamp(EventType.NOTE)[0] as NoteEvent).text)
                .isEqualTo(note.text)
        assertThat((repository.findAllByEventTypeOrderByTimestamp(EventType.MILESTONE)[0] as MilestoneEvent).milestone)
                .isEqualTo(milestone.milestone)
    }

    @Test
    @DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
    fun eventsAccessibleByRun() {
        val run = runRepository.save(NuzlockeRunBuilder().build())
        eventRepository.save(NoteEventBuilder().nuzlockeRun(run).build())

        TestTransaction.flagForCommit()
        TestTransaction.end()
        TestTransaction.start()

        assertThat(runRepository.getReferenceById(run.id).events.size).isEqualTo(1)
        assertThat(eventRepository.findAll()[0].nuzlockeRun.id).isEqualTo(run.id)
    }


    @Test
    fun timestampGeneration() {
        val run = runRepository.save(NuzlockeRunBuilder().build())
        val one = repository.save(NoteEventBuilder().nuzlockeRun(run).build())
        Thread.sleep(1000)
        val two = repository.save(NoteEventBuilder().nuzlockeRun(run).build())
        val three = repository.save(NoteEventBuilder().nuzlockeRun(run).build())

        val deltaOne = two.timestamp.time - one.timestamp.time
        val deltaTwo = three.timestamp.time - two.timestamp.time
        assertThat(deltaOne).isGreaterThanOrEqualTo(1000)
        assertThat(deltaTwo).isLessThan(1000)
    }

    @Test
    fun findAllByNuzlockeRunId() {
        val run = runRepository.save(NuzlockeRunBuilder().build())
        eventRepository.save(NoteEventBuilder().nuzlockeRun(run).build())
        eventRepository.save(NoteEventBuilder().nuzlockeRun(run).build())

        assertThat(repository.findAllByNuzlockeRunIdOrderByTimestamp(run.id).size).isEqualTo(2)
        assertThat(repository.findAllByNuzlockeRunIdOrderByTimestamp(1000).size).isEqualTo(0)
    }
}