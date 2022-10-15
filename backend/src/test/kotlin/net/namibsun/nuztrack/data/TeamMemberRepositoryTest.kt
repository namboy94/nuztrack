package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NuzlockeRunRepository
import net.namibsun.nuztrack.data.TeamMemberRepository
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.testbuilders.model.events.DeathEventBuilder
import net.namibsun.nuztrack.testbuilders.model.events.EncounterEventBuilder
import net.namibsun.nuztrack.testbuilders.model.events.EvolutionEventBuilder
import net.namibsun.nuztrack.testbuilders.model.events.TeamMemberSwitchEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.transaction.TestTransaction


@DataJpaTest
class TeamMemberRepositoryTest {

    @Autowired
    lateinit var repository: TeamMemberRepository

    @Autowired
    lateinit var runRepository: NuzlockeRunRepository

    @Autowired
    lateinit var eventRepository: EventRepository

    @Test
    fun findAllForNuzlockeRun() {
        val runOne = runRepository.save(NuzlockeRunBuilder().id(1).build())
        val runTwo = runRepository.save(NuzlockeRunBuilder().id(2).build())
        val encounterOne = eventRepository.save(EncounterEventBuilder().nuzlockeRun(runOne).caught(true).build())
        val encounterTwo = eventRepository.save(EncounterEventBuilder().nuzlockeRun(runOne).caught(true).build())
        val encounterThree = eventRepository.save(EncounterEventBuilder().nuzlockeRun(runTwo).caught(true).build())
        repository.save(TeamMemberBuilder().encounter(encounterOne).build())
        repository.save(TeamMemberBuilder().encounter(encounterTwo).isBulbasaur().build())
        repository.save(TeamMemberBuilder().encounter(encounterThree).isCharizard().build())

        assertThat(repository.findAll().size).isEqualTo(3)
        assertThat(repository.findAllByNuzlockeRunId(runOne.id).size).isEqualTo(2)
        assertThat(repository.findAllByNuzlockeRunId(runTwo.id).size).isEqualTo(1)
    }

    @Test
    @DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
    fun testAddEventsForTeamMember() {
        val run = runRepository.save(NuzlockeRunBuilder().build())
        val encounter = eventRepository.save(EncounterEventBuilder().nuzlockeRun(run).caught(true).build())
        val teamMember = repository.save(TeamMemberBuilder().encounter(encounter).isCharizard().build())

        eventRepository.save(EvolutionEventBuilder()
                .teamMember(teamMember)
                .nuzlockeRun(run)
                .newPokedexNumber(5)
                .previousPokedexNumber(4)
                .build()
        )
        eventRepository.save(EvolutionEventBuilder()
                .teamMember(teamMember)
                .nuzlockeRun(run)
                .newPokedexNumber(6)
                .previousPokedexNumber(5)
                .build()
        )
        eventRepository.save(DeathEventBuilder().nuzlockeRun(run).teamMember(teamMember).build())
        eventRepository.save(TeamMemberSwitchEventBuilder().nuzlockeRun(run).teamMember(teamMember).isAdd().build())
        eventRepository.save(TeamMemberSwitchEventBuilder().nuzlockeRun(run).teamMember(teamMember).isRemove().build())

        TestTransaction.flagForCommit()
        TestTransaction.end()
        TestTransaction.start()

        assertThat(repository.getReferenceById(teamMember.id).encounter).isNotNull
        assertThat(repository.getReferenceById(teamMember.id).evolutions.size).isEqualTo(2)
        assertThat(repository.getReferenceById(teamMember.id).death).isNotNull
        assertThat(repository.getReferenceById(teamMember.id).teamSwitches.size).isEqualTo(2)

        assertThat((
                eventRepository.findAllByEventTypeOrderByTimestamp(EventType.ENCOUNTER)[0] as EncounterEvent)
                .teamMember).isNotNull
        assertThat((
                eventRepository.findAllByEventTypeOrderByTimestamp(EventType.EVOLUTION)[0] as EvolutionEvent)
                .teamMember).isNotNull
        assertThat((
                eventRepository.findAllByEventTypeOrderByTimestamp(EventType.DEATH)[0] as DeathEvent)
                .teamMember).isNotNull
        assertThat((eventRepository.findAllByEventTypeOrderByTimestamp(
                EventType.TEAM_MEMBER_SWITCH
        )[0] as TeamMemberSwitchEvent).teamMember).isNotNull
    }

    @Test
    fun getTeamMemberByIdAndNuzlockeRunId() {
        val run = runRepository.save(NuzlockeRunBuilder().build())
        val encounter = eventRepository.save(EncounterEventBuilder().nuzlockeRun(run).caught(true).build())
        val member = repository.save(TeamMemberBuilder().encounter(encounter).isCharizard().build())

        assertThat(repository.getTeamMemberByIdAndNuzlockeRunId(run.id, member.id)).isEqualTo(member)
        assertThat(repository.getTeamMemberByIdAndNuzlockeRunId(1000, member.id)).isNull()
        assertThat(repository.getTeamMemberByIdAndNuzlockeRunId(run.id, 1000)).isNull()
    }
}
