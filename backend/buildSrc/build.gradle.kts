plugins {
    `kotlin-dsl`
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("gradle-plugin"))
    implementation("org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.20")
    implementation("org.jetbrains.kotlin:kotlin-allopen:1.7.20")
    implementation("org.jetbrains.kotlin:kotlin-noarg:1.7.20")
    implementation("org.springframework.boot:spring-boot-gradle-plugin:2.7.5")
    implementation("io.spring.gradle:dependency-management-plugin:1.1.0")
}