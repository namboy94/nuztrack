package net.namibsun.nuztrack.data

import org.springframework.stereotype.Service

@Service
class TestService(val db: TestRepositories) {

    fun find(): List<TestTable> = db.findAll()

    fun set(x: TestTable) {
        db.save(x)
        TestTable()
    }
}