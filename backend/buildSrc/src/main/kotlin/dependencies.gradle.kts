plugins {
    kotlin("jvm")
}

dependencies {
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    runtimeOnly("com.h2database:h2:2.1.212")
    runtimeOnly("org.postgresql:postgresql")
}