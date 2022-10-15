package net.namibsun.nuztrack

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class NuztrackApplication

fun main(args: Array<String>) {
    runApplication<NuztrackApplication>(*args)
}
