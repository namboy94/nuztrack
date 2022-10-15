package net.namibsun.nuztrack.testbuilders.model

import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Rules
import net.namibsun.nuztrack.constants.enums.RunStatus
import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.MultiRunNuzlocke
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.Event
import net.namibsun.nuztrack.testbuilders.model.events.*
import net.namibsun.nuztrack.transfer.CreateNuzlockeRunTO
import net.namibsun.nuztrack.transfer.NuzlockeRunTO

data class NuzlockeRunBuilder(
        var id: Long = 1, var userName: String = "Ash Ketchum", var name: String = "My First Nuzlocke",
        var game: Games = Games.FIRERED, var rules: List<Rules> = Rules.defaultRules(),
        var customRules: List<String> = listOf("Meowth has 9 lives"), var status: RunStatus = RunStatus.ACTIVE,
        var events: MutableList<Event> = mutableListOf(), var multiRun: MultiRunNuzlocke? = null,
        var saveFile: List<Byte>? = null
) {
    fun id(id: Long) = apply { this.id = id }
    fun userName(userName: String) = apply { this.userName = userName }
    fun name(name: String) = apply { this.name = name }
    fun game(game: Games) = apply { this.game = game }
    fun rules(rules: List<Rules>) = apply { this.rules = rules }
    fun customRules(customRules: List<String>) = apply { this.customRules = customRules }
    fun status(status: RunStatus) = apply { this.status = status }
    fun events(events: MutableList<Event>) = apply { this.events = events }
    fun multiRun(multiRun: MultiRunNuzlocke) = apply { this.multiRun = multiRun }
    fun saveFile(saveFile: ByteArray) = apply { this.saveFile = saveFile.toList() }

    fun build(): NuzlockeRun {
        val run = NuzlockeRun(
                id, userName, name, game, rules, customRules, status, events, multiRun, saveFile?.toByteArray()
        )
        run.events.map { it.nuzlockeRun = run }
        return run
    }

    fun addDefaultEvents() = apply {
        val teamMemberOne = TeamMemberBuilder().nickname("One").encounter(
                EncounterEventBuilder().caught(true).build()
        ).build()
        val teamMemberTwo = TeamMemberBuilder().nickname("Two").encounter(
                EncounterEventBuilder().caught(true).build()
        ).build()
        val teamMemberThree = TeamMemberBuilder().nickname("Three").encounter(
                EncounterEventBuilder().caught(true).build()
        ).build()
        this.events.addAll(
                mutableListOf(
                        teamMemberOne.encounter, teamMemberTwo.encounter, teamMemberThree.encounter,
                        DeathEventBuilder().teamMember(teamMemberThree).build(),
                        EvolutionEventBuilder().teamMember(teamMemberOne).build(),
                        TeamMemberSwitchEventBuilder().teamMember(teamMemberOne).switchType(TeamMemberSwitchType.ADD)
                                .build(), NoteEventBuilder().build(), MilestoneEventBuilder().build()
                )
        )
    }

    fun buildCreatorTO() = CreateNuzlockeRunTO(name, game.name, rules.map { it.name }, customRules)
    fun buildTO() = NuzlockeRunTO.fromNuzlockeRun(this.build())

}
