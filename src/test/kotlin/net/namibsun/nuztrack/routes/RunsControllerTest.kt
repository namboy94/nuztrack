package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.NotFoundException
import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.*
import org.springframework.http.HttpStatus
import java.security.Principal

internal class RunsControllerTest {

    private val principal: Principal = mock()
    private val service: NuzlockeRunService = mock()
    private val controller = RunsController(service)

    private val runOneBuilder = NuzlockeRunBuilder().id(1)
    private val runOne = runOneBuilder.build()
    private val runOneTO = runOneBuilder.buildTO()
    private val runOneCreator = runOneBuilder.buildCreatorTO()

    private val runTwoBuilder = NuzlockeRunBuilder().id(2)
    private val runTwo = runTwoBuilder.build()
    private val runTwoTO = runTwoBuilder.buildTO()

    private val runs = listOf(runOne, runTwo)
    private val runTOs = listOf(runOneTO, runTwoTO)

    @BeforeEach
    fun setUp() {
        whenever(principal.name).thenReturn(runOne.userName)
        whenever(service.getRuns(any())).thenReturn(listOf())
        whenever(service.getRuns(runOne.userName)).thenReturn(runs)
        whenever(service.getRun(runOne.id)).thenReturn(runOne)
        whenever(service.getRun(runTwo.id)).thenReturn(runTwo)
        whenever(service.deleteRun(any())).then {}
    }

    @Test
    fun getRuns_existing() {
        val result = controller.getRuns(principal)

        verify(service, times(1)).getRuns(runOne.userName)
        verify(principal, times(1)).name
        assertThat(result.body).hasSameElementsAs(runTOs)
    }

    @Test
    fun getRuns_noExisting() {
        whenever(principal.name).thenReturn("Gary")

        val result = controller.getRuns(principal)

        verify(service, times(1)).getRuns("Gary")
        verify(principal, times(1)).name
        assertThat(result.body).isEmpty()
    }

    @Test
    fun createRun_valid() {
        whenever(service.createRun(
                runOne.userName,
                runOne.name,
                runOne.game,
                runOne.rules,
                runOne.customRules
        )).thenReturn(runOne)

        val result = controller.createRun(runOneCreator, principal)

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(result.body).isEqualTo(runOneTO)
        verify(service, times(1)).createRun(
                runOne.userName,
                runOne.name,
                runOne.game,
                runOne.rules,
                runOne.customRules
        )
        verify(principal, times(1)).name
    }

    @Test
    fun createRun_invalidinput() {
        val thrown = assertThrows<ValidationException> {
            controller.createRun(NuzlockeRunBuilder().name("").buildCreatorTO(), principal)
        }

        assertThat(thrown.message).isEqualTo(ErrorMessages.EMPTY_NAME.message)
        verify(service, times(0)).createRun(any(), any(), any(), any(), any())
    }

    @Test
    fun getRun_success() {
        val result = controller.getRun(runOne.id, principal)

        verify(principal, times(1)).name
        verify(service, times(1)).getRun(runOne.id)
        assertThat(result.body).isEqualTo(runOneTO)
    }

    @Test
    fun getRun_doesNotExist() {
        val thrown = assertThrows<NotFoundException> {
            controller.getRun(1000, principal)
        }

        verify(principal, times(1)).name
        verify(service, times(1)).getRun(1000)
        assertThat(thrown.message).isEqualTo(ErrorMessages.RUN_NOT_FOUND.message)
    }

    @Test
    fun getRun_noAccessRights() {
        whenever(principal.name).thenReturn("Gary")
        whenever(service.getRun(runOne.id)).thenReturn(runOne)

        val thrown = assertThrows<UnauthorizedException> {
            controller.getRun(runOne.id, principal)
        }

        verify(principal, times(1)).name
        verify(service, times(1)).getRun(runOne.id)
        assertThat(thrown.message).isEqualTo(ErrorMessages.NO_ACCESS_TO_RUN.message)
    }

    @Test
    fun deleteRun_success() {
        val result = controller.deleteRun(runOne.id, principal)

        verify(principal, times(1)).name
        verify(service, times(1)).getRun(runOne.id)
        verify(service, times(1)).deleteRun(runOne.id)
        assertThat(result.statusCode).isEqualTo(HttpStatus.OK)
    }

    @Test
    fun deleteRun_doesNotExist() {
        val thrown = assertThrows<NotFoundException> {
            controller.deleteRun(1000, principal)
        }

        verify(principal, times(1)).name
        verify(service, times(1)).getRun(1000)
        verify(service, times(0)).deleteRun(1000)
        assertThat(thrown.message).isEqualTo(ErrorMessages.RUN_NOT_FOUND.message)
    }

    @Test
    fun deleteRun_noAccessRights() {
        whenever(principal.name).thenReturn("Gary")
        whenever(service.getRun(runOne.id)).thenReturn(runOne)

        val thrown = assertThrows<UnauthorizedException> {
            controller.deleteRun(runOne.id, principal)
        }

        verify(principal, times(1)).name
        verify(service, times(1)).getRun(runOne.id)
        verify(service, times(0)).deleteRun(runOne.id)
        assertThat(thrown.message).isEqualTo(ErrorMessages.NO_ACCESS_TO_RUN.message)
    }
}
