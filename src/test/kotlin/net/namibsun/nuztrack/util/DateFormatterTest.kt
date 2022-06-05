package net.namibsun.nuztrack.util

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.util.*

class DateFormatterTest {
    @Test
    fun testFormattingDate() {
        assertThat(formatDateToIsoString(Date(1584239133273))).isEqualTo("2020-03-15T02:25:33.273Z")
    }
}