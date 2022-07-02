package net.namibsun.nuztrack.util

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows

class ValidationTest {

    @Test
    fun testValidateLevel() {
        assertDoesNotThrow { validateLevel(1) }
        assertDoesNotThrow { validateLevel(100) }

        assertThat(assertThrows<ValidationException> {
            validateLevel(-15)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            validateLevel(0)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            validateLevel(101)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            validateLevel(150)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
    }

    @Test
    fun testValidateTeamMember_noRealMember() {
        assertThat(assertThrows<ValidationException> {
            validateTeamMember(null, false, 100)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER.message)
    }

    @Test
    fun testValidateTeamMember_memberDead() {
        val member = TeamMemberBuilder().isDead().build()
        assertThat(assertThrows<ValidationException> {
            validateTeamMember(member, true, 100)
        }.message).isEqualTo(ErrorMessages.TEAM_MEMBER_IS_DEAD.message)
        assertDoesNotThrow { validateTeamMember(member, false, 100) }
    }

    @Test
    fun testValidateTeamMemberLevel() {
        val member = TeamMemberBuilder().level(50).build()
        assertThat(assertThrows<ValidationException> {
            validateTeamMember(member, true, 49)
        }.message).isEqualTo(ErrorMessages.LEVEL_BELOW_CURRENT.message)
        assertDoesNotThrow { validateTeamMember(member, true, 50) }
    }
}
