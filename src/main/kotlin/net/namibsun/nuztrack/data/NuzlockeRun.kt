package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.pokemon.Game
import net.namibsun.nuztrack.routes.runs.CreateNuzlockeRunTO
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import javax.persistence.*

@Entity
@Table(name = "runs")
class NuzlockeRun(
        @Column(nullable = false) @Id @GeneratedValue var id: Int? = null,
        @Column var userName: String,
        @Column var name: String,
        @Column @Enumerated(EnumType.STRING) var game: Game,
        @Column var death: Boolean,
        @Column var mustNickname: Boolean,
        @Column var onlyFirstEncounter: Boolean,
        @Column var duplicateClause: Boolean,
        @Column var duplicateClauseIncludesFailedEncounters: Boolean,
        @Column var duplicateClauseIncludesEntireSpecies: Boolean,
        @Column var noTradedPokemon: Boolean,
        @Column var noGiftedPokemon: Boolean,
        @Column var noLegendaryPokemon: Boolean,
        @Column var noItems: Boolean,
        @Column var noItemsInBattle: Boolean,
        @Column var noXIteams: Boolean,
        @Column var noPokeMarts: Boolean,
        @Column var noPokeCenters: Boolean
)

@Repository
interface NuzlockeRunRepository : JpaRepository<NuzlockeRun, Long> {
    fun findByUserName(userName: String): List<NuzlockeRun>
}

@Service
class NuzlockeRunService(val db: NuzlockeRunRepository) {

    fun getRuns(userName: String): List<NuzlockeRun> {
        return db.findByUserName(userName)
    }

    fun createRun(run: CreateNuzlockeRunTO, userName: String) {
        val rules = run.rules
        val runEntity = NuzlockeRun(
                userName = userName,
                name = run.name,
                game = Game.valueOf(run.game),
                death = rules.death,
                mustNickname = rules.mustNickname,
                onlyFirstEncounter = rules.onlyFirstEncounter,
                duplicateClause = rules.duplicateClause,
                duplicateClauseIncludesFailedEncounters = rules.duplicateClauseIncludesFailedEncounters,
                duplicateClauseIncludesEntireSpecies = rules.duplicateClauseIncludesEntireSpecies,
                noTradedPokemon = rules.noTradedPokemon,
                noGiftedPokemon = rules.noGiftedPokemon,
                noLegendaryPokemon = rules.noLegendaryPokemon,
                noItems = rules.noItems,
                noItemsInBattle = rules.noItemsInBattle,
                noXIteams = rules.noXIteams,
                noPokeMarts = rules.noPokeMarts,
                noPokeCenters = rules.noPokeCenters
        )
        println(runEntity.id)
        db.save(runEntity)
        println(runEntity.id)
    }
}
