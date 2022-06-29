package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.testconstants.MultiRunNuzlockeBuilder
import net.namibsun.nuztrack.testconstants.NuzlockeRunBuilder
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.mockito.kotlin.*
import java.util.*

class MultiRunNuzlockeServiceTest {

    private val repository: MultiRunNuzlockeRepository = mock()
    private val service = MultiRunNuzlockeService(repository)
    private val multiRun = MultiRunNuzlockeBuilder().build()
    private val newRunOne = NuzlockeRunBuilder().id(3).build()
    private val newRunTwo = NuzlockeRunBuilder().id(4).build()

    @Test
    fun getOrCreateMultiRunForRun_multiRunExists() {
        whenever(repository.findById(multiRun.id)).thenReturn(Optional.of(multiRun))

        val result = service.getOrCreateMultiRunForRun(multiRun.runs[0])

        verify(repository, times(1)).findById(multiRun.id)
        verify(repository, times(0)).save(any())
        Assertions.assertThat(result).isEqualTo(multiRun)
    }

    @Test
    fun getOrCreateMultiRunForRun_noMultiRun() {
        whenever(repository.save(any<MultiRunNuzlocke>())).thenReturn(multiRun)

        val result = service.getOrCreateMultiRunForRun(newRunOne)

        verify(repository, times(0)).findById(any())
        verify(repository, times(1)).save(any())
        Assertions.assertThat(result).isEqualTo(multiRun)
    }

    @Test
    fun getOrCreateMultiRunForRun_multiRunCouldNotBeFound() {
        whenever(repository.save(any<MultiRunNuzlocke>())).thenReturn(multiRun)
        whenever(repository.findById(multiRun.id)).thenReturn(Optional.empty())

        val result = service.getOrCreateMultiRunForRun(multiRun.runs[0])

        verify(repository, times(1)).findById(multiRun.id)
        verify(repository, times(1)).save(any())
        Assertions.assertThat(result).isEqualTo(multiRun)
    }

    @Test
    fun linkRuns_withExisting() {
        whenever(repository.findById(multiRun.id)).thenReturn(Optional.of(multiRun))
        whenever(repository.save(any<MultiRunNuzlocke>())).thenReturn(multiRun)

        val result = service.linkRuns(multiRun.runs[0], newRunOne)

        verify(repository, times(1)).findById(multiRun.id)
        verify(repository, times(1)).save(any())
        Assertions.assertThat(result).isEqualTo(multiRun)
    }

    @Test
    fun linkRuns_withTwoNew() {
        whenever(repository.save(any<MultiRunNuzlocke>())).thenReturn(multiRun)

        val result = service.linkRuns(newRunOne, newRunTwo)

        verify(repository, times(0)).findById(any())
        verify(repository, times(2)).save(any())
        Assertions.assertThat(result).isEqualTo(multiRun)
    }

}