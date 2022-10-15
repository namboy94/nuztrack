package net.namibsun.nuztrack.data

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "multi_run_nuzlocke")
class MultiRunNuzlocke(
        @Id @GeneratedValue val id: Long = 0,

        @OneToMany(mappedBy = "multiRun", cascade = [CascadeType.ALL])
        @OrderBy("id")
        var runs: MutableList<NuzlockeRun> = mutableListOf(),
)

@Repository
interface MultiRunNuzlockeRepository : JpaRepository<MultiRunNuzlocke, Long>

@Service
class MultiRunNuzlockeService(val db: MultiRunNuzlockeRepository, val runDb: NuzlockeRunRepository) {

    fun linkRuns(existing: NuzlockeRun, newRun: NuzlockeRun): MultiRunNuzlocke {
        if (existing.multiRun == null) {
            existing.multiRun = db.save(MultiRunNuzlocke())
            runDb.save(existing)
        }
        newRun.multiRun = existing.multiRun
        runDb.save(newRun)
        return newRun.multiRun!!
    }
}
