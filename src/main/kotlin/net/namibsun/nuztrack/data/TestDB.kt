package net.namibsun.nuztrack.data

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "test")
class TestTable (@Id @GeneratedValue var id: Int)
