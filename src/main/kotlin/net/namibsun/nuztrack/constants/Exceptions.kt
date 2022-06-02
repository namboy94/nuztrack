package net.namibsun.nuztrack.constants

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.BAD_REQUEST)
class ValidationException(errorMessage: ErrorMessages) : RuntimeException(errorMessage.message)

@ResponseStatus(HttpStatus.NOT_FOUND)
class NotFoundException(errorMessage: ErrorMessages) : RuntimeException(errorMessage.message)

@ResponseStatus(HttpStatus.UNAUTHORIZED)
class UnauthorizedException(errorMessage: ErrorMessages) : RuntimeException(errorMessage.message)