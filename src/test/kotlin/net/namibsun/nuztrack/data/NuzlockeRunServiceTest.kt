package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.util.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.AdditionalAnswers
import org.mockito.kotlin.*
import java.util.*

class NuzlockeRunServiceTest {

    private val repository: NuzlockeRunRepository = mock()
    private val service = NuzlockeRunService(repository)
    private val username = "Ash"
    private val exampleOne = NuzlockeRun(
        5, username, "First", Games.RED, listOf(Rules.DEATH), listOf("myRules"), status = RunStatus.COMPLETED
    )
    private val exampleTwo = NuzlockeRun(
        10, username, "Second", Games.YELLOW, listOf(), listOf("myRules"), status = RunStatus.FAILED
    )

    @Test
    fun getRun_runExists() {
        whenever(repository.findById(exampleOne.id!!)).thenReturn(Optional.of(exampleOne))

        val result = service.getRun(exampleOne.id!!)

        verify(repository, times(1)).findById(5)
        assertThat(result).isEqualTo(exampleOne)
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
        whenever(repository.findByUserName(username)).thenReturn(listOf(exampleOne, exampleTwo))

        val ashResults = service.getRuns(username)

        verify(repository, times(1)).findByUserName(username)
        assertThat(ashResults).hasSameElementsAs(listOf(exampleOne, exampleTwo))
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
        whenever(repository.save(any<NuzlockeRun>())).thenReturn(exampleOne)

        val result = service.createRun(
                exampleOne.userName,
                exampleOne.name,
                exampleOne.game,
                exampleOne.rules,
                exampleOne.customRules
        )

        assertThat(result).isEqualTo(exampleOne)
        verify(repository, times(1)).save(any())
    }

    @Test
    fun makeSureRunIsSetToActive() {
        @Suppress("RemoveExplicitTypeArguments")
        whenever(repository.save(any<NuzlockeRun>())).then(AdditionalAnswers.returnsFirstArg<NuzlockeRun>())

        val result = service.createRun(
            exampleOne.userName,
            exampleOne.name,
            exampleOne.game,
            exampleOne.rules,
            exampleOne.customRules
        )

        assertThat(result.status).isNotEqualTo(exampleOne.status)
        assertThat(result.status).isEqualTo(RunStatus.ACTIVE)
        verify(repository, times(1)).save(any())
    }

    @Test
    fun createRun_invalidName() {

        val thrown = assertThrows<ValidationException> {
            service.createRun(username, "", Games.RED, listOf(), listOf())
        }

        assertThat(thrown.message).isEqualTo(ErrorMessages.EMPTY_NAME.message)
        verify(repository, times(0)).save(any())
    }

    @Test
    fun deleteRun() {
        whenever(repository.deleteById(exampleOne.id!!)).then {}

        val result = service.deleteRun(exampleOne.id!!)

        assertThat(result).isEqualTo(Unit)
        verify(repository, times(1)).deleteById(exampleOne.id!!)
    }

}