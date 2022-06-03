package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.constants.*
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
        @Column val userName: String,
        @Column val name: String,
        @Column @Enumerated(EnumType.STRING) val game: Games,
        @ElementCollection @CollectionTable(name = "rules") @Enumerated(EnumType.STRING) val rules: List<Rules>,
        @ElementCollection @CollectionTable(name = "custom_rules") val customRules: List<String>,
        @Enumerated(EnumType.STRING) val status: RunStatus
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

    fun createRun(
            userName: String,
            name: String,
            game: Games,
            rules: List<Rules>,
            customRules: List<String>
    ): NuzlockeRun {

        if (userName == "" || name == "") {
            throw ValidationException(ErrorMessages.EMPTY_NAME)
        }

        return db.save(NuzlockeRun(
                userName = userName,
                name = name,
                game = game,
                rules = rules,
                customRules = customRules,
                status = RunStatus.ACTIVE
        ))
    }

    fun deleteRun(id: Long) {
        db.deleteById(id)
    }
}
