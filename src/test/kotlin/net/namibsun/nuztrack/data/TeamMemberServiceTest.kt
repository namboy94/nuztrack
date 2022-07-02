package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.testbuilders.model.events.EncounterEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.*

internal class TeamMemberServiceTest {

    private val repository: TeamMemberRepository = mock()
    private val service = TeamMemberService(repository)

    private val run = NuzlockeRunBuilder().build()
    private val memberOne = TeamMemberBuilder().id(1).isActive().build()
    private val memberTwo = TeamMemberBuilder().id(2).isBulbasaur().build()
    private val memberThree = TeamMemberBuilder().id(3).isCharizard().isDead().build()
    private val members = listOf(memberOne, memberTwo, memberThree)

    @BeforeEach
    fun setUp() {
        whenever(repository.findAllByNuzlockeRunId(run.id)).thenReturn(members)
        whenever(repository.getReferenceById(memberOne.id)).thenReturn(memberOne)
        whenever(repository.getReferenceById(memberTwo.id)).thenReturn(memberTwo)
        whenever(repository.getReferenceById(memberThree.id)).thenReturn(memberThree)
        whenever(repository.save(any<TeamMember>())).thenAnswer { it.getArgument(0) }
    }

    @Test
    fun getAllForNuzlockeRun() {
        val results = service.getAllTeamMembers(run.id)

        assertThat(results).isEqualTo(members)
        verify(repository, times(1)).findAllByNuzlockeRunId(run.id)
    }

    @Test
    fun createTeamMember() {
        val encounter = EncounterEventBuilder().nuzlockeRun(run).build()
        val member = service.createTeamMember(encounter, "Nick", Gender.MALE, Natures.BRAVE, 1)

        assertThat(member.level).isEqualTo(encounter.level)
        assertThat(member.nickname).isEqualTo("Nick")
        verify(repository, times(1)).save(any())
    }

    @Test
    fun createTeamMember_NoAbilityOrNatureOrGender() {
        val encounter = EncounterEventBuilder().nuzlockeRun(run).build()
        val member = service.createTeamMember(encounter, "Nick", null, null, null)

        assertThat(member.level).isEqualTo(encounter.level)
        assertThat(member.nickname).isEqualTo("Nick")
        assertThat(member.nature).isNull()
        assertThat(member.abilitySlot).isNull()
        assertThat(member.gender).isNull()
        verify(repository, times(1)).save(any())
    }

    @Test
    fun getTeam() {
        val (active, boxed, dead) = service.getTeam(run.id)

        assertThat(active).isEqualTo(listOf(memberOne))
        assertThat(boxed).isEqualTo(listOf(memberTwo))
        assertThat(dead).isEqualTo(listOf(memberThree))

        verify(repository, times(1)).findAllByNuzlockeRunId(run.id)
    }

    @Test
    fun getTeamMember() {
        whenever(repository.getTeamMemberByIdAndNuzlockeRunId(1, 1)).thenReturn(memberOne)
        whenever(repository.getTeamMemberByIdAndNuzlockeRunId(1, 2)).thenReturn(null)
        whenever(repository.getTeamMemberByIdAndNuzlockeRunId(2, 1)).thenReturn(null)

        assertThat(service.getTeamMember(1, 1)).isEqualTo(memberOne)
        assertThat(service.getTeamMember(1, 2)).isEqualTo(null)
        assertThat(service.getTeamMember(2, 1)).isEqualTo(null)

        verify(repository, times(1)).getTeamMemberByIdAndNuzlockeRunId(1, 1)
        verify(repository, times(1)).getTeamMemberByIdAndNuzlockeRunId(1, 2)
        verify(repository, times(1)).getTeamMemberByIdAndNuzlockeRunId(2, 1)
    }

    @Test
    fun setLevel() {
        val adjusted = service.setLevel(memberOne.id, 45)

        assertThat(adjusted.level).isEqualTo(45)
        verify(repository, times(1)).getReferenceById(memberOne.id)
        verify(repository, times(1)).save(memberOne)
    }

    @Test
    fun evolveTo() {
        val adjusted = service.evolveTo(memberTwo.id, 2)

        assertThat(adjusted.pokedexNumber).isEqualTo(2)
        verify(repository, times(1)).getReferenceById(memberTwo.id)
        verify(repository, times(1)).save(memberTwo)
    }
}