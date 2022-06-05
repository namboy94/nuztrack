package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.data.events.EncounterEvent
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.AdditionalAnswers
import org.mockito.kotlin.*

internal class TeamMemberServiceTest {

    private val repository: TeamMemberRepository = mock()
    private val service = TeamMemberService(repository)

    @Test
    fun getAllForNuzlockeRun() {
        whenever(repository.findAllByNuzlockeRunId(NUZLOCKE_RUN.id)).thenReturn(listOf(TEAM_MEMBER))

        val results = service.getAllForNuzlockeRun(NUZLOCKE_RUN)

        assertThat(results).isEqualTo(listOf(TEAM_MEMBER))
        verify(repository, times(1)).findAllByNuzlockeRunId(NUZLOCKE_RUN.id)
    }

    @Test
    fun createTeamMember() {
        whenever(repository.save(any<TeamMember>())).then(AdditionalAnswers.returnsFirstArg<EncounterEvent>())

        val member = service.createTeamMember(ENCOUNTER, "Poli", Natures.BRAVE, 2)

        assertThat(member.level).isEqualTo(ENCOUNTER.level)
        assertThat(member.nickname).isEqualTo("Poli")
        verify(repository, times(1)).save(any<TeamMember>())
    }
}