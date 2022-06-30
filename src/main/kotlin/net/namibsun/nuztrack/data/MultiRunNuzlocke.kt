package net.namibsun.nuztrack.data

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.findByIdOrNull
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
class MultiRunNuzlockeService(val db: MultiRunNuzlockeRepository) {

    fun linkRuns(existing: NuzlockeRun, newRun: NuzlockeRun): MultiRunNuzlocke {
        val multiRun = getOrCreateMultiRunForRun(existing)
        multiRun.runs.add(newRun)
        return db.save(multiRun)
    }

    fun getOrCreateMultiRunForRun(run: NuzlockeRun): MultiRunNuzlocke {
        return (if (run.multiRun == null) {
            db.save(MultiRunNuzlocke(runs = mutableListOf(run)))
        } else {
            db.findByIdOrNull(run.multiRun!!.id)
        }) ?: db.save(MultiRunNuzlocke(runs = mutableListOf(run)))
    }
}
