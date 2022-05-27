package net.namibsun.nuztrack.data

import javax.persistence.*

@Entity
@Table(name = "test")
open class TestTable(@Id @GeneratedValue @Column(name = "id", nullable = false) open var id: Int? = null)
