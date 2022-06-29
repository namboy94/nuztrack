package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.enums.MultiRunOptions
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class MultiRunOptionTOTest {
    @Test
    fun testConverting() {
        val converted = MultiRunOptionTO.fromOption(MultiRunOptions.INCLUDE_BOX)
        assertThat(converted).isEqualTo(MultiRunOptionTO(
                MultiRunOptions.INCLUDE_BOX.name,
                MultiRunOptions.INCLUDE_BOX.description
        ))
    }
}