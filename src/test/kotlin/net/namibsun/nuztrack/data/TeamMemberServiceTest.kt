package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.constants.enums.*
import net.namibsun.nuztrack.data.events.DeathEvent
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.AdditionalAnswers
import org.mockito.kotlin.*

internal class TeamMemberServiceTest {

    private val repository: TeamMemberRepository = mock()
    private val service = TeamMemberService(repository)

    private val user = "Ash"
    private val nuzlockeRun = NuzlockeRun(
            5, user, "First", Games.RED, listOf(Rules.ONLY_FIRST_ENCOUNTER), listOf(), RunStatus.COMPLETED
    )

    private val teamMemberOne = TeamMember(
            1, "A", 1, 1, Gender.MALE, Natures.BOLD, 1,
            EncounterEvent(nuzlockeRun, "A", 1, 1, true),
            teamSwitches = mutableListOf(
                    TeamMemberSwitchEvent(nuzlockeRun, "A", TEAM_MEMBER, TeamMemberSwitchType.ADD)
            )
    )
    private val teamMemberTwo = TeamMember(
            1, "B", 1, 1, Gender.MALE, Natures.ADAMANT, 1,
            EncounterEvent(nuzlockeRun, "B", 1, 1, true),
            teamSwitches = mutableListOf(
                    TeamMemberSwitchEvent(nuzlockeRun, "B", TEAM_MEMBER, TeamMemberSwitchType.ADD),
                    TeamMemberSwitchEvent(nuzlockeRun, "B", TEAM_MEMBER, TeamMemberSwitchType.REMOVE)
            )
    )
    private val teamMemberThree = TeamMember(
            1, "C", 1, 1, Gender.MALE, Natures.NAUGHTY, 1,
            EncounterEvent(nuzlockeRun, "C", 1, 1, true),
            teamSwitches = mutableListOf(
                    TeamMemberSwitchEvent(nuzlockeRun, "C", TEAM_MEMBER, TeamMemberSwitchType.ADD)
            ),
            death = DeathEvent(nuzlockeRun, "C", TEAM_MEMBER, 1, "C", "C")
    )


    @Test
    fun getAllForNuzlockeRun() {
        whenever(repository.findAllByNuzlockeRunId(NUZLOCKE_RUN.id)).thenReturn(listOf(TEAM_MEMBER))

        val results = service.getAllTeamMembers(NUZLOCKE_RUN.id)

        assertThat(results).isEqualTo(listOf(TEAM_MEMBER))
        verify(repository, times(1)).findAllByNuzlockeRunId(NUZLOCKE_RUN.id)
    }

    @Test
    fun createTeamMember() {
        whenever(repository.save(any<TeamMember>())).then(AdditionalAnswers.returnsFirstArg<EncounterEvent>())

        val member = service.createTeamMember(ENCOUNTER, "Poli", Gender.MALE, Natures.BRAVE, 2)

        assertThat(member.level).isEqualTo(ENCOUNTER.level)
        assertThat(member.nickname).isEqualTo("Poli")
        verify(repository, times(1)).save(any<TeamMember>())
    }

    @Test
    fun createTeamMember_NoAbilityOrNatureOrGender() {
        whenever(repository.save(any<TeamMember>())).then(AdditionalAnswers.returnsFirstArg<EncounterEvent>())

        val member = service.createTeamMember(ENCOUNTER, "Poli", null, null, null)

        assertThat(member.level).isEqualTo(ENCOUNTER.level)
        assertThat(member.nickname).isEqualTo("Poli")
        assertThat(member.nature).isNull()
        assertThat(member.abilitySlot).isNull()
        verify(repository, times(1)).save(any<TeamMember>())
    }

    @Test
    fun getTeam() {
        whenever(repository.findAllByNuzlockeRunId(NUZLOCKE_RUN.id))
                .thenReturn(listOf(teamMemberOne, teamMemberTwo, teamMemberThree))

        val (active, boxed, dead) = service.getTeam(NUZLOCKE_RUN.id)

        assertThat(active).isEqualTo(listOf(teamMemberOne))
        assertThat(boxed).isEqualTo(listOf(teamMemberTwo))
        assertThat(dead).isEqualTo(listOf(teamMemberThree))

        verify(repository, times(1)).findAllByNuzlockeRunId(NUZLOCKE_RUN.id)
    }

    @Test
    fun getTeamMember() {
        whenever(repository.getTeamMemberByIdAndNuzlockeRunId(1, 1)).thenReturn(teamMemberOne)
        whenever(repository.getTeamMemberByIdAndNuzlockeRunId(1, 2)).thenReturn(null)
        whenever(repository.getTeamMemberByIdAndNuzlockeRunId(2, 1)).thenReturn(null)

        assertThat(service.getTeamMember(1, 1)).isEqualTo(teamMemberOne)
        assertThat(service.getTeamMember(1, 2)).isEqualTo(null)
        assertThat(service.getTeamMember(2, 1)).isEqualTo(null)

        verify(repository, times(1)).getTeamMemberByIdAndNuzlockeRunId(1, 1)
        verify(repository, times(1)).getTeamMemberByIdAndNuzlockeRunId(1, 2)
        verify(repository, times(1)).getTeamMemberByIdAndNuzlockeRunId(2, 1)
    }

    @Test
    fun setLevel() {
        val member = TeamMember(50, "A", 1, 1, Gender.MALE, Natures.NAUGHTY, 1, ENCOUNTER)
        whenever(repository.getReferenceById(member.id)).thenReturn(member)
        whenever(repository.save(member)).thenReturn(member)

        val adjusted = service.setLevel(member.id, 45)

        assertThat(adjusted.level).isEqualTo(45)
        verify(repository, times(1)).getReferenceById(member.id)
        verify(repository, times(1)).save(member)
    }

    @Test
    fun evolveTo() {
        val member = TeamMember(50, "A", 1, 1, Gender.MALE, Natures.NAUGHTY, 1, ENCOUNTER)
        whenever(repository.getReferenceById(member.id)).thenReturn(member)
        whenever(repository.save(member)).thenReturn(member)

        val adjusted = service.evolveTo(member.id, 2)

        assertThat(adjusted.pokedexNumber).isEqualTo(2)
        verify(repository, times(1)).getReferenceById(member.id)
        verify(repository, times(1)).save(member)
    }
}