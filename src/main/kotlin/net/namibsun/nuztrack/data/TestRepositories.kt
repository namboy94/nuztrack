package net.namibsun.nuztrack.data
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository

@Repository
interface TestRepositories : JpaRepository<TestTable, Long> {

}