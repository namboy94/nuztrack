package net.namibsun.nuztrack.util

import java.text.SimpleDateFormat
import java.util.*

private fun createFormat(): SimpleDateFormat {
    val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    dateFormat.timeZone = TimeZone.getTimeZone("UTC")
    return dateFormat
}

fun formatDateToIsoString(date: Date): String {
    return createFormat().format(date)
}

fun parseDateFromIsoString(isoString: String): Date {
    return createFormat().parse(isoString)
}
