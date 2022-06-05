package net.namibsun.nuztrack.util

import java.text.SimpleDateFormat
import java.util.*

fun formatDateToIsoString(date: Date): String {
    val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    dateFormat.timeZone = TimeZone.getTimeZone("UTC")
    return dateFormat.format(date)
}
