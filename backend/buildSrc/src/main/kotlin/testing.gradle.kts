plugins {
    kotlin("jvm")
    id("jacoco")
}

dependencies {
    testImplementation("org.assertj:assertj-core")
    testImplementation("org.mockito.kotlin:mockito-kotlin:4.0.0")
}

jacoco {
    toolVersion = "0.8.8"
    reportsDirectory.set(layout.buildDirectory.dir("jacocoReports"))
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.test {
    finalizedBy(tasks.jacocoTestReport)
}
tasks.jacocoTestReport {
    dependsOn(tasks.test)
}

