package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.constants.enums.RunStatus
import net.namibsun.nuztrack.testconstants.NuzlockeRunBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.AdditionalAnswers
import org.mockito.kotlin.*
import java.util.*

class NuzlockeRunServiceTest {

    private val repository: NuzlockeRunRepository = mock()
    private val service = NuzlockeRunService(repository)

    private val runOne = NuzlockeRunBuilder().status(RunStatus.COMPLETED).build()
    private val runTwo = NuzlockeRunBuilder().id(2).build()

    @Test
    fun getRun_runExists() {
        whenever(repository.findById(runOne.id)).thenReturn(Optional.of(runOne))

        val result = service.getRun(runOne.id)

        verify(repository, times(1)).findById(runOne.id)
        assertThat(result).isEqualTo(runOne)
    }

    @Test
    fun getRun_runDoesNotExist() {
        whenever(repository.findById(15)).thenReturn(Optional.ofNullable(null))

        val result = service.getRun(15)

        verify(repository, times(1)).findById(15)
        assertThat(result).isNull()
    }

    @Test
    fun getRuns_userHasRuns() {
        whenever(repository.findByUserName(runOne.userName)).thenReturn(listOf(runOne, runTwo))

        val ashResults = service.getRuns(runOne.userName)

        verify(repository, times(1)).findByUserName(runOne.userName)
        assertThat(ashResults).hasSameElementsAs(listOf(runOne, runTwo))
    }

    @Test
    fun getRuns_userHasNoRuns() {
        val gary = "Gary"
        whenever(repository.findByUserName(gary)).thenReturn(listOf())

        val garyResults = service.getRuns(gary)

        verify(repository, times(1)).findByUserName(gary)
        assertThat(garyResults).isEmpty()
    }

    @Test
    fun createRun_valid() {
        @Suppress("RemoveExplicitTypeArguments")
        whenever(repository.save(any<NuzlockeRun>())).thenReturn(runOne)

        val result = service.createRun(
                runOne.userName,
                runOne.name,
                runOne.game,
                runOne.rules,
                runOne.customRules
        )

        assertThat(result).isEqualTo(runOne)
        verify(repository, times(1)).save(any())
    }

    @Test
    fun makeSureRunIsSetToActive() {
        whenever(repository.save(any<NuzlockeRun>())).then(AdditionalAnswers.returnsFirstArg<NuzlockeRun>())

        val result = service.createRun(
                runOne.userName,
                runOne.name,
                runOne.game,
                runOne.rules,
                runOne.customRules
        )
        assertThat(result.status).isNotEqualTo(runOne.status)
        assertThat(result.status).isEqualTo(RunStatus.ACTIVE)
        verify(repository, times(1)).save(any())
    }

    @Test
    fun deleteRun() {
        whenever(repository.deleteById(runOne.id)).then {}

        val result = service.deleteRun(runOne.id)

        assertThat(result).isEqualTo(Unit)
        verify(repository, times(1)).deleteById(runOne.id)
    }

}