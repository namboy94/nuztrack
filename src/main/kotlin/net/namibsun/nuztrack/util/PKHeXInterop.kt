package net.namibsun.nuztrack.util

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import net.namibsun.nuztrack.transfer.NuzlockeRunExportTO
import net.namibsun.nuztrack.transfer.PKHeXPokemon
import java.io.File

const val scriptfile = "scripts/NuztrackSaves/bin/Debug/net6.0/linux-x64/NuztrackSaves"


fun readPokemonDetailsWithPKHeX(sourceData: ByteArray): List<PKHeXPokemon>? {
    val sourceFile = File.createTempFile("nuztrack-", "-src.sav")
    val targetFile = File.createTempFile("nuztrack-", "-export.json")

    sourceFile.writeBytes(sourceData)

    val call = ProcessBuilder(
            scriptfile,
            "--mode", "PRINT",
            "--source", sourceFile.absolutePath,
            "--target", targetFile.absolutePath
    )
    val process = call.start()
    process.waitFor()

    if (process.exitValue() != 0) {
        println(String(process.inputStream.readAllBytes()))
        println(String(process.errorStream.readAllBytes()))
        return null
    }

    val resultJson: List<PKHeXPokemon> = jacksonObjectMapper().readValue(targetFile)

    sourceFile.delete()
    targetFile.delete()

    return resultJson
}

fun transferRunWithPKHeX(sourceData: ByteArray, targetData: ByteArray, nuztrackExport: NuzlockeRunExportTO): ByteArray? {

    val sourceFile = File.createTempFile("nuztrack-", "-src.sav")
    val targetFile = File.createTempFile("nuztrack-", "-dst.sav")
    val exportFile = File.createTempFile("nuztrack-", "-exp.json")

    sourceFile.writeBytes(sourceData)
    targetFile.writeBytes(targetData)
    jacksonObjectMapper().writeValue(exportFile, nuztrackExport)

    val call = ProcessBuilder(
            scriptfile,
            "--mode", "TRANSPORT",
            "--source", sourceFile.absolutePath,
            "--target", targetFile.absolutePath,
            "--run", exportFile.absolutePath
    )
    val process = call.start()
    process.waitFor()

    if (process.exitValue() != 0) {
        println(String(process.inputStream.readAllBytes()))
        println(String(process.errorStream.readAllBytes()))
        return null
    }

    val result = targetFile.readBytes()
    targetFile.delete()
    sourceFile.delete()
    exportFile.delete()
    return result
}