package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.util.Games
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import javax.persistence.*

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

    fun createRun(run: NuzlockeRun) {
        db.save(run)
    }

    fun deleteRun(run: NuzlockeRun) {
        db.delete(run)
    }
}
