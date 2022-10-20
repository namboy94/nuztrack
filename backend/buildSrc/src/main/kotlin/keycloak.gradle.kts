plugins {
    kotlin("jvm")
    id("io.spring.dependency-management")
}

java.sourceCompatibility = JavaVersion.VERSION_17

dependencies {
    implementation("org.keycloak:keycloak-spring-boot-starter")
}

dependencyManagement {
    imports {
        mavenBom("org.keycloak.bom:keycloak-adapter-bom:13.0.1")
    }
}
