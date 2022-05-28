package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.util.ErrorMessages
import net.namibsun.nuztrack.util.Games
import net.namibsun.nuztrack.util.ValidationException
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "runs")
class NuzlockeRun(
        @Column(nullable = false) @Id @GeneratedValue var id: Long? = null,
        @Column var userName: String,
        @Column var name: String,
        @Column @Enumerated(EnumType.STRING) var game: Games,
        @ElementCollection @CollectionTable(name = "rules") val rules: List<String>
)

@Repository
interface NuzlockeRunRepository : JpaRepository<NuzlockeRun, Long> {
    fun findByUserName(userName: String): List<NuzlockeRun>
}

@Service
class NuzlockeRunService(val db: NuzlockeRunRepository) {

    fun getRun(id: Long): NuzlockeRun? {
        return this.db.findByIdOrNull(id)
    }

    fun getRuns(userName: String): List<NuzlockeRun> {
        return db.findByUserName(userName)
    }

    fun createRun(userName: String, name: String, game: Games, rules: List<String>): NuzlockeRun {

        if (name == "") {
            throw ValidationException(ErrorMessages.EMPTY_NAME)
        }

        return db.save(NuzlockeRun(userName = userName, name = name, game = game, rules = rules))
    }

    fun deleteRun(id: Long) {
        db.deleteById(id)
    }
}
