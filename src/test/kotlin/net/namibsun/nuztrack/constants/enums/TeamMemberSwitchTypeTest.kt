package net.namibsun.nuztrack.constants.enums

import net.namibsun.nuztrack.constants.ValidationException
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class TeamMemberSwitchTypeTest {

    @Test
    fun getValueOfTeamMemberSwitchType_success() {
        assertThat(TeamMemberSwitchType.valueOfWithChecks(TeamMemberSwitchType.ADD.name.lowercase())).isEqualTo(TeamMemberSwitchType.ADD)
        assertThat(TeamMemberSwitchType.valueOfWithChecks(TeamMemberSwitchType.REMOVE.name.lowercase())).isEqualTo(TeamMemberSwitchType.REMOVE)
    }

    @Test
    fun getValueOfTeamMemberSwitchTypeTitle_invalid() {
        assertThat(assertThrows<ValidationException> {
            TeamMemberSwitchType.valueOfWithChecks("NotExisting")
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER_SWITCH_TYPE.message)
        assertThat(assertThrows<ValidationException> {
            TeamMemberSwitchType.valueOfWithChecks("")
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER_SWITCH_TYPE.message)
        assertThat(assertThrows<ValidationException> {
            TeamMemberSwitchType.valueOfWithChecks(null)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER_SWITCH_TYPE.message)
    }
}