package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.events.DeathEvent
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.data.events.EvolutionEvent
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "team_member")
class TeamMember(
        @Id @GeneratedValue val id: Long = 0,
        @Column var nickname: String,
        @Column var pokedexNumber: Int,
        @Column var level: Int,
        @Column val nature: Natures,
        @Column val abilitySlot: Int,

        @OneToOne(cascade = [CascadeType.ALL])
        @JoinColumn(name = "encounter_id")
        val encounter: EncounterEvent,

        @OneToOne(mappedBy = "teamMember", cascade = [CascadeType.ALL])
        val death: DeathEvent? = null,

        @OneToMany(mappedBy = "teamMember", cascade = [CascadeType.ALL])
        @OrderBy("timestamp")
        val evolutions: List<EvolutionEvent> = listOf(),

        @OneToMany(mappedBy = "teamMember", cascade = [CascadeType.ALL])
        @OrderBy("timestamp")
        val teamSwitches: List<TeamMemberSwitchEvent> = listOf(),
)

@Repository
interface TeamMemberRepository : JpaRepository<TeamMember, Long> {
    @Query("SELECT m FROM TeamMember m " +
            "INNER JOIN EncounterEvent e ON m.encounter.id = e.id " +
            "WHERE e.nuzlockeRun.id = :runId")
    fun findAllByNuzlockeRunId(@Param("runId") nuzlockeRunId: Long): List<TeamMember>

    @Query("SELECT m FROM TeamMember m " +
            "INNER JOIN EncounterEvent e ON m.encounter.id = e.id " +
            "WHERE e.nuzlockeRun.id = :runId AND m.id = :id")
    fun getTeamMemberByIdAndNuzlockeRunId(@Param("runId") nuzlockeRunId: Long, @Param("id") id: Long): TeamMember?
}

@Service
class TeamMemberService(val db: TeamMemberRepository) {
    fun getTeamMember(runId: Long, teamMemberId: Long): TeamMember? {
        return db.getTeamMemberByIdAndNuzlockeRunId(runId, teamMemberId)
    }

    fun getAllTeamMembers(runId: Long): List<TeamMember> {
        return db.findAllByNuzlockeRunId(runId)
    }

    fun getTeam(runId: Long): Triple<List<TeamMember>, List<TeamMember>, List<TeamMember>> {
        val allMembers = getAllTeamMembers(runId)
        val (alive, dead) = allMembers.partition { it.death == null }
        val (active, boxed) = alive.partition {
            it.teamSwitches.isNotEmpty() && it.teamSwitches.last().switchType == TeamMemberSwitchType.ADD
        }
        return Triple(active, boxed, dead)
    }

    fun createTeamMember(
            encounter: EncounterEvent,
            nickname: String,
            nature: Natures,
            abilitySlot: Int
    ): TeamMember {
        return db.save(TeamMember(
                encounter = encounter,
                level = encounter.level,
                pokedexNumber = encounter.pokedexNumber,
                nickname = nickname,
                abilitySlot = abilitySlot,
                nature = nature
        ))
    }

    fun setLevel(memberId: Long, level: Int): TeamMember {
        val member = db.getReferenceById(memberId)
        member.level = level
        return db.save(member)
    }

    fun evolveTo(memberId: Long, newPokedexNumber: Int): TeamMember {
        val member = db.getReferenceById(memberId)
        member.pokedexNumber = newPokedexNumber
        return db.save(member)
    }
}