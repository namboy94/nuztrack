package net.namibsun.nuztrack.testbuilders.model

import net.namibsun.nuztrack.data.MultiRunNuzlocke
import net.namibsun.nuztrack.data.NuzlockeRun

data class MultiRunNuzlockeBuilder(
        var id: Long = 1,
        var runs: MutableList<NuzlockeRun> = mutableListOf(
                NuzlockeRunBuilder().id(1).build(),
                NuzlockeRunBuilder().id(2).build()
        )
) {
    fun id(id: Long) = apply { this.id = id }
    fun runs(runs: MutableList<NuzlockeRun>) = apply { this.runs = runs }
    fun build(): MultiRunNuzlocke {
        val multiRun = MultiRunNuzlocke(id, runs)
        runs.map { it.multiRun = multiRun }
        return multiRun
    }
}