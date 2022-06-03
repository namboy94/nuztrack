package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.*
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.transfer.CreateNuzlockeRunTO
import net.namibsun.nuztrack.transfer.NuzlockeRunTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.*
import org.springframework.http.HttpStatus
import java.security.Principal

internal class RunsControllerTest {

    private val userOne = "Ash"
    private val userTwo = "Gary"
    private val principal: Principal = mock()
    private val service: NuzlockeRunService = mock()
    private val controller = RunsController(service)
    private val exampleOne = NuzlockeRun(
            5, userOne, "First", Games.RED, listOf(Rules.DEATH), listOf("MyRules"), RunStatus.COMPLETED
    )
    private val exampleTwo = NuzlockeRun(
            10, userOne, "Second", Games.YELLOW, listOf(), listOf(), RunStatus.FAILED
    )
    private val exampleOneTO = NuzlockeRunTO.fromNuzlockeRun(exampleOne)
    private val exampleTwoTO = NuzlockeRunTO.fromNuzlockeRun(exampleTwo)
    private val creatorOne = CreateNuzlockeRunTO(
            exampleOne.name, exampleOne.game.title, listOf(Rules.DEATH.name.lowercase()), listOf("MyRules")
    )

    @Test
    fun getRuns_existing() {
        whenever(service.getRuns(userOne)).thenReturn(listOf(exampleOne, exampleTwo))
        whenever(principal.name).thenReturn(userOne)

        val result = controller.getRuns(principal)

        verify(service, times(1)).getRuns(userOne)
        verify(principal, times(1)).name
        assertThat(result.body).hasSameElementsAs(listOf(exampleOneTO, exampleTwoTO))
    }

    @Test
    fun getRuns_noExisting() {
        whenever(service.getRuns(userTwo)).thenReturn(listOf())
        whenever(principal.name).thenReturn(userTwo)

        val result = controller.getRuns(principal)

        verify(service, times(1)).getRuns(userTwo)
        verify(principal, times(1)).name
        assertThat(result.body).isEmpty()
    }

    @Test
    fun createRun_valid() {
        whenever(principal.name).thenReturn(userOne)
        whenever(service.createRun(
                exampleOne.userName,
                exampleOne.name,
                exampleOne.game,
                exampleOne.rules,
                exampleOne.customRules
        )).thenReturn(exampleOne)

        val result = controller.createRun(creatorOne, principal)

        verify(service, times(1)).createRun(
                exampleOne.userName,
                exampleOne.name,
                exampleOne.game,
                exampleOne.rules,
                exampleOne.customRules
        )
        verify(principal, times(1)).name
        assertThat(result.body).isEqualTo(exampleOneTO)
    }

    @Test
    fun createRun_invalidName() {
        whenever(principal.name).thenReturn(userOne)
        whenever(service.createRun(userOne, "", Games.RED, listOf(), listOf())).thenThrow(
                ValidationException(ErrorMessages.EMPTY_NAME)
        )

        val thrown = assertThrows<ValidationException> {
            controller.createRun(CreateNuzlockeRunTO("", Games.RED.title, listOf(), listOf()), principal)
        }

        assertThat(thrown.message).isEqualTo(ErrorMessages.EMPTY_NAME.message)
        verify(principal, times(1)).name
        verify(service, times(1)).createRun(userOne, "", Games.RED, listOf(), listOf())
    }

    @Test
    fun createRun_invalidGame() {
        val thrown = assertThrows<ValidationException> {
            controller.createRun(CreateNuzlockeRunTO("ABC", "ABC", listOf(), listOf()), principal)
        }

        assertThat(thrown.message).isEqualTo(ErrorMessages.INVALID_GAME.message)
        verify(principal, times(0)).name
        verify(service, times(0)).createRun(any(), any(), any(), any(), any())
    }

    @Test
    fun createRun_invalidRule() {

        val thrown = assertThrows<ValidationException> {
            controller.createRun(CreateNuzlockeRunTO(
                    "ABC", Games.RED.title, listOf("doesNotExist"), listOf()
            ), principal)
        }

        assertThat(thrown.message).isEqualTo(ErrorMessages.INVALID_RULE.message)
        verify(principal, times(0)).name
        verify(service, times(0)).createRun(any(), any(), any(), any(), any())
    }

    @Test
    fun getRun_success() {
        whenever(principal.name).thenReturn(userOne)
        whenever(service.getRun(exampleOne.id!!)).thenReturn(exampleOne)

        val result = controller.getRun(exampleOne.id!!, principal)

        verify(principal, times(1)).name
        verify(service, times(1)).getRun(exampleOne.id!!)
        assertThat(result.body).isEqualTo(exampleOneTO)
    }

    @Test
    fun getRun_doesNotExist() {
        whenever(principal.name).thenReturn(userOne)
        whenever(service.getRun(100)).thenReturn(null)

        val thrown = assertThrows<NotFoundException> {
            controller.getRun(100, principal)
        }

        verify(principal, times(1)).name
        verify(service, times(1)).getRun(100)
        assertThat(thrown.message).isEqualTo(ErrorMessages.RUN_NOT_FOUND.message)
    }

    @Test
    fun getRun_noAccessRights() {
        whenever(principal.name).thenReturn(userTwo)
        whenever(service.getRun(exampleOne.id!!)).thenReturn(exampleOne)

        val thrown = assertThrows<UnauthorizedException> {
            controller.getRun(exampleOne.id!!, principal)
        }

        verify(principal, times(1)).name
        verify(service, times(1)).getRun(exampleOne.id!!)
        assertThat(thrown.message).isEqualTo(ErrorMessages.NO_ACCESS_TO_RUN.message)
    }

    @Test
    fun deleteRun_success() {
        whenever(principal.name).thenReturn(userOne)
        whenever(service.getRun(exampleOne.id!!)).thenReturn(exampleOne)
        whenever(service.deleteRun(exampleOne.id!!)).then {}

        val result = controller.deleteRun(exampleOne.id!!, principal)

        verify(principal, times(1)).name
        verify(service, times(1)).getRun(exampleOne.id!!)
        verify(service, times(1)).deleteRun(exampleOne.id!!)
        assertThat(result.statusCode).isEqualTo(HttpStatus.OK)
    }

    @Test
    fun deleteRun_doesNotExist() {
        whenever(principal.name).thenReturn(userOne)
        whenever(service.getRun(100)).thenReturn(null)

        val thrown = assertThrows<NotFoundException> {
            controller.deleteRun(100, principal)
        }

        verify(principal, times(1)).name
        verify(service, times(1)).getRun(100)
        verify(service, times(0)).deleteRun(100)
        assertThat(thrown.message).isEqualTo(ErrorMessages.RUN_NOT_FOUND.message)
    }

    @Test
    fun deleteRun_noAccess() {
        whenever(principal.name).thenReturn(userTwo)
        whenever(service.getRun(exampleOne.id!!)).thenReturn(exampleOne)

        val thrown = assertThrows<UnauthorizedException> {
            controller.deleteRun(exampleOne.id!!, principal)
        }

        verify(principal, times(1)).name
        verify(service, times(1)).getRun(exampleOne.id!!)
        verify(service, times(0)).deleteRun(exampleOne.id!!)
        assertThat(thrown.message).isEqualTo(ErrorMessages.NO_ACCESS_TO_RUN.message)
    }
}
