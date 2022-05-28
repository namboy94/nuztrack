export function getSelectedRunId(): number {
    let runId = NaN
    const runIdString: string | null = localStorage.getItem("runId")
    if (runIdString !== null) {
        runId = parseInt(runIdString)
    }
    if (isNaN(runId)) {
        runId = -1
    }
    return runId
}