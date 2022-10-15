package net.namibsun.nuztrack.util

import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.testbuilders.model.events.DeathEventBuilder
import net.namibsun.nuztrack.testbuilders.model.events.EncounterEventBuilder
import net.namibsun.nuztrack.transfer.NuzlockeRunExportTO
import net.namibsun.nuztrack.transfer.NuzlockeRunTO
import net.namibsun.nuztrack.transfer.PKHeXPokemon
import net.namibsun.nuztrack.transfer.TeamTO
import net.namibsun.nuztrack.transfer.events.EventLogTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.condition.DisabledIfEnvironmentVariable
import org.springframework.core.io.ClassPathResource

@DisabledIfEnvironmentVariable(named = "NO_DOTNET", matches = "1")
class PKHeXInteropTest {

    private val memberBuilder = TeamMemberBuilder().setGame(Games.YELLOW)
    private val pika = memberBuilder.nickname("Pika").pokedexNumber(25).level(5).build()
    private val bulba = memberBuilder.nickname("Bulba").pokedexNumber(1).level(10).build()
    private val wartor = memberBuilder.nickname("Wartor").pokedexNumber(8).level(20).build()
    private val char = memberBuilder.nickname("Char").pokedexNumber(6).level(40).isDead().build()
    private val members = listOf(pika, bulba, wartor, char)

    @Test
    fun readPokemonDetailsWithPKHeX() {
        val yellow = ClassPathResource("saves/YELLOW.sav").inputStream.readAllBytes()
        val results = readPokemonDetailsWithPKHeX(yellow)!!

        assertThat(results.size).isEqualTo(members.size)
        assertThat(results.filter { it.active }.size).isEqualTo(1)
        assertThat(results.filter { !it.active }.size).isEqualTo(3)

        val nicknameMap = results.associateBy { it.nickName }

        members.map {
            assertThat(nicknameMap[it.nickname]!!).isEqualTo(PKHeXPokemon(
                    it.nickname,
                    it.pokedexNumber,
                    it.nickname in nicknameMap.filter { it.value.active },
                    it.level,
                    null, null, null
            ))
        }
    }

    @Test
    fun readPokemonDetailsWithPKHeX_badSave() {
        assertThat(readPokemonDetailsWithPKHeX(ByteArray(0))).isNull()
    }

    @Test
    fun transferRunWithPKHeX() {
        val yellow = ClassPathResource("saves/YELLOW.sav").inputStream.readAllBytes()
        val ruby = ClassPathResource("saves/RUBY.sav").inputStream.readAllBytes()
        val result = transferRunWithPKHeX(yellow, ruby, this.generateExport())!!

        val newData = readPokemonDetailsWithPKHeX(result)!!
        val active = newData.filter { it.active }
        val box = newData.filter { !it.active }.associateBy { it.nickName }

        assertThat(active.size).isEqualTo(1)
        assertThat(box.size).isEqualTo(members.size + 1)

        members.filter { it.death == null }.map {
            assertThat(box[it.nickname]!!.level).isEqualTo(5)
            assertThat(box[it.nickname]!!.species).isEqualTo(Pokedex.getPokemon(it.pokedexNumber).baseSpecies)
        }
        members.filter { it.death != null }.map {
            assertThat(box[it.nickname]!!.level).isEqualTo(it.level)
            assertThat(box[it.nickname]!!.species).isEqualTo(it.pokedexNumber)
        }
    }

    @Test
    fun transferRunWithPKHeX_badSave() {
        assertThat(transferRunWithPKHeX(ByteArray(0), ByteArray(0), this.generateExport())).isNull()
    }

    private fun generateExport(): NuzlockeRunExportTO {
        val newMembers = members.map {
            TeamMemberBuilder()
                    .setGame(Games.RUBY)
                    .nickname(it.nickname)
                    .level(if (it.death == null) 5 else it.level)
                    .pokedexNumber(
                            if (it.death == null) Pokedex.getPokemon(it.pokedexNumber).baseSpecies
                            else it.pokedexNumber
                    )
                    .death(if (it.death == null) null else DeathEventBuilder().location("Previous Game").build())
                    .encounter(EncounterEventBuilder().location("Previous Game").build())
                    .build()
        }

        val events = newMembers.map { it.encounter } + newMembers.filter { it.death != null }.map { it.death!! }
        val team = Triple(
                newMembers.filter { it.nickname == pika.nickname },
                newMembers.filter { it.nickname != pika.nickname && it.death == null },
                newMembers.filter { it.death != null }
        )
        val run = NuzlockeRunBuilder().events(events.toMutableList()).build()
        return NuzlockeRunExportTO(
                NuzlockeRunTO.fromNuzlockeRun(run),
                EventLogTO.fromEvents(events),
                TeamTO.fromTeam(team)
        )
    }
}