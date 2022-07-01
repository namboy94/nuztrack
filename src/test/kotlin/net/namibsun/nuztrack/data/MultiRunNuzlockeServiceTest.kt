package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.testbuilders.model.MultiRunNuzlockeBuilder
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.mockito.kotlin.*

class MultiRunNuzlockeServiceTest {

    private val repository: MultiRunNuzlockeRepository = mock()
    private val runRepository: NuzlockeRunRepository = mock()
    private val service = MultiRunNuzlockeService(repository, runRepository)
    private val multiRun = MultiRunNuzlockeBuilder()
            .runs(mutableListOf(NuzlockeRunBuilder().id(1).build()))
            .build()
    private val otherRun = NuzlockeRunBuilder().id(2).build()
    private val newRun = NuzlockeRunBuilder().id(3).build()

    @Test
    fun linkRuns_withExisting() {
        whenever(repository.save(any<MultiRunNuzlocke>())).thenReturn(multiRun)
        whenever(runRepository.save(any<NuzlockeRun>())).thenAnswer { args -> args.getArgument(0) }

        val result = service.linkRuns(multiRun.runs[0], newRun)

        verify(repository, times(0)).save(any())
        verify(runRepository, times(0)).save(multiRun.runs[0])
        verify(runRepository, times(1)).save(newRun)
        Assertions.assertThat(result).isEqualTo(multiRun)
    }

    @Test
    fun linkRuns_withTwoNew() {
        whenever(repository.save(any<MultiRunNuzlocke>())).thenReturn(multiRun)
        whenever(runRepository.save(any<NuzlockeRun>())).thenAnswer { args -> args.getArgument(0) }

        val result = service.linkRuns(otherRun, newRun)

        verify(repository, times(1)).save(any())
        verify(runRepository, times(1)).save(otherRun)
        verify(runRepository, times(1)).save(newRun)
        Assertions.assertThat(result).isEqualTo(multiRun)
    }

}