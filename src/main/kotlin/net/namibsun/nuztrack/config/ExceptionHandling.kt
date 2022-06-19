package net.namibsun.nuztrack.config

import net.namibsun.nuztrack.constants.NotFoundException
import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

data class ExceptionPayload(val reason: String?)

@ControllerAdvice
class ExceptionHandling {

    @ExceptionHandler(ValidationException::class)
    fun validationException(exception: ValidationException): ResponseEntity<ExceptionPayload> {
        return ResponseEntity(ExceptionPayload(exception.message), HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(NotFoundException::class)
    fun validationException(exception: NotFoundException): ResponseEntity<ExceptionPayload> {
        return ResponseEntity(ExceptionPayload(exception.message), HttpStatus.NOT_FOUND)
    }

    @ExceptionHandler(UnauthorizedException::class)
    fun validationException(exception: UnauthorizedException): ResponseEntity<ExceptionPayload> {
        return ResponseEntity(ExceptionPayload(exception.message), HttpStatus.UNAUTHORIZED)
    }
}