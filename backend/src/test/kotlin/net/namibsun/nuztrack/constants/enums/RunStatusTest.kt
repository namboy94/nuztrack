package net.namibsun.nuztrack.constants.enums

import net.namibsun.nuztrack.constants.ValidationException
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class RunStatusTest {

    @Test
    fun getValueOfRunStatus_success() {
        Assertions.assertThat(RunStatus.valueOfWithChecks(RunStatus.ACTIVE.name.lowercase()))
                .isEqualTo(RunStatus.ACTIVE)
        Assertions.assertThat(RunStatus.valueOfWithChecks(RunStatus.COMPLETED.name.uppercase()))
                .isEqualTo(RunStatus.COMPLETED)
        Assertions.assertThat(RunStatus.valueOfWithChecks("FaIlED"))
                .isEqualTo(RunStatus.FAILED)
    }

    @Test
    fun getValueOfRunStatus_invalid() {
        Assertions.assertThat(assertThrows<ValidationException> {
            RunStatus.valueOfWithChecks("NotExisting")
        }.message).isEqualTo(ErrorMessages.INVALID_RUN_STATUS.message)
        Assertions.assertThat(assertThrows<ValidationException> {
            RunStatus.valueOfWithChecks("")
        }.message).isEqualTo(ErrorMessages.INVALID_RUN_STATUS.message)
        Assertions.assertThat(assertThrows<ValidationException> {
            RunStatus.valueOfWithChecks(null)
        }.message).isEqualTo(ErrorMessages.INVALID_RUN_STATUS.message)
    }
}
