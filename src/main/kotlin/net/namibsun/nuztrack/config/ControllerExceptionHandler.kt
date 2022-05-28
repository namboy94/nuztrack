//package net.namibsun.nuztrack.config
//
//import net.namibsun.nuztrack.util.NuzlockeException
//import org.springframework.http.HttpStatus
//import org.springframework.http.ResponseEntity
//import org.springframework.web.bind.annotation.ControllerAdvice
//import org.springframework.web.bind.annotation.ExceptionHandler
//import org.springframework.web.bind.annotation.ResponseBody
//import org.springframework.web.bind.annotation.ResponseStatus
//
//@ControllerAdvice
//class ControllerExceptionHandler {
//
//    @ExceptionHandler(NuzlockeException::class)
//    @ResponseStatus(HttpStatus.BAD_REQUEST)
//    @ResponseBody
//    fun handleIllegalArguments(): ResponseEntity<ErrorMessage> {
//        ResponseEntity.status()
//        return ResponseEntity.badRequest().body(ErrorMessage("Invalid Argument"))
//    }
//
//}
//
//data class ErrorMessage(val error: String)