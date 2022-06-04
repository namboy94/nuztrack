package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.*
import net.namibsun.nuztrack.data.*
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
        val runOne = runRepository.save(NUZLOCKE_RUN)
        val runTwo = runRepository.save(NuzlockeRun(
                0, "AAAAAA", "AAA", Games.SILVER,
                listOf(), listOf(), RunStatus.COMPLETED
        ))
        val encounterOne = eventRepository.save(EncounterEvent(runOne, "A", 1, 1, Gender.MALE, true))
        val encounterTwo = eventRepository.save(EncounterEvent(runOne, "A", 1, 1, Gender.MALE, true))
        val encounterThree = eventRepository.save(EncounterEvent(runTwo, "A", 1, 1, Gender.MALE, true))
        repository.save(TeamMember(0, "NICK", 1, 1, Natures.BRAVE, 1, encounterOne))
        repository.save(TeamMember(0, "NICK", 1, 1, Natures.BRAVE, 1, encounterTwo))
        repository.save(TeamMember(0, "NICK", 1, 1, Natures.BRAVE, 1, encounterThree))

        assertThat(repository.findAll().size).isEqualTo(3)
        assertThat(repository.findAllByNuzlockeRunId(runOne.id).size).isEqualTo(2)
        assertThat(repository.findAllByNuzlockeRunId(runTwo.id).size).isEqualTo(1)
    }

    @Test
    @DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
    fun testAddEventsForTeamMember() {
        val run = runRepository.save(NUZLOCKE_RUN)
        val encounter = eventRepository.save(EncounterEvent(
                run, "A", 1, 1, Gender.MALE, true
        ))


        val teamMember = repository.save(TeamMember(
                nickname = "B",
                species = 1,
                level = 2,
                nature = Natures.BRAVE,
                abilitySlot = 1,
                encounter = encounter
        ))
        eventRepository.save(EvolutionEvent(run, "A", teamMember, 15, 1, 2))
        eventRepository.save(EvolutionEvent(run, "B", teamMember, 30, 2, 3))
        eventRepository.save(DeathEvent(run, "C", teamMember, 25, "C", "C"))
        eventRepository.save(TeamMemberSwitchEvent(run, "X", teamMember, TeamMemberSwitchType.ADD))
        eventRepository.save(TeamMemberSwitchEvent(run, "X", teamMember, TeamMemberSwitchType.REMOVE))

        TestTransaction.flagForCommit()
        TestTransaction.end()
        TestTransaction.start()

        assertThat(repository.getReferenceById(teamMember.id).encounter).isNotNull
        assertThat(repository.getReferenceById(teamMember.id).evolutions.size).isEqualTo(2)
        assertThat(repository.getReferenceById(teamMember.id).death).isNotNull
        assertThat(repository.getReferenceById(teamMember.id).teamSwitches.size).isEqualTo(2)

        assertThat((eventRepository.findAllByEventType(EventType.ENCOUNTER)[0] as EncounterEvent).teamMember).isNotNull
        assertThat((eventRepository.findAllByEventType(EventType.EVOLUTION)[0] as EvolutionEvent).teamMember).isNotNull
        assertThat((eventRepository.findAllByEventType(EventType.DEATH)[0] as DeathEvent).teamMember).isNotNull
        assertThat((eventRepository.findAllByEventType(
                EventType.PARTY_MEMBER_SWITCH
        )[0] as TeamMemberSwitchEvent).teamMember).isNotNull
    }
}