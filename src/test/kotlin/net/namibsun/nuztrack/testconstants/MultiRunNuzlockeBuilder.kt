package net.namibsun.nuztrack.testconstants

import net.namibsun.nuztrack.data.MultiRunNuzlocke

data class MultiRunNuzlockeBuilder(
        var id: Long = 1,
        var runBuilders: List<NuzlockeRunBuilder> = listOf(NuzlockeRunBuilder(), NuzlockeRunBuilder().id(2))
) {
    fun id(id: Long) = apply { this.id = id }
    fun runBuilders(runBuilders: List<NuzlockeRunBuilder>) = apply { this.runBuilders = runBuilders }
    fun build(): MultiRunNuzlocke {
        val dummy = MultiRunNuzlocke(id, runBuilders.map { it.build() })
        return MultiRunNuzlocke(id, runBuilders.map { it.multiRun(dummy).build() })
    }
}