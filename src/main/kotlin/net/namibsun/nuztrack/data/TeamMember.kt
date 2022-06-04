package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.constants.Natures
import net.namibsun.nuztrack.data.events.DeathEvent
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.data.events.EvolutionEvent
import net.namibsun.nuztrack.data.events.TeamRemoveEvent
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "team_member")
class TeamMember(
        @Id @GeneratedValue val id: Long = 0,
        @Column val nickname: String,
        @Column val species: Int,
        @Column val level: Int,
        @Column val nature: Natures,
        @Column val abilitySlot: Int,

        @OneToOne(mappedBy = "teamMember")
        val encounter: EncounterEvent,

        @OneToOne(mappedBy = "teamMember")
        val death: DeathEvent? = null,

        @OneToMany(mappedBy = "teamMember", cascade = [CascadeType.ALL])
        val evolutions: List<EvolutionEvent> = listOf(),

        @OneToMany(mappedBy = "teamMember", cascade = [CascadeType.ALL])
        val teamAdds: List<TeamRemoveEvent> = listOf(),

        @OneToMany(mappedBy = "teamMember", cascade = [CascadeType.ALL])
        val teamRemoves: List<TeamRemoveEvent> = listOf(),
)
