import {useNavigate} from "react-router";
import {NotificationFN} from "../../../components/Snackbar";
import {runsService} from "../../../data/runs/runs.service";
import {NuzlockeRun} from "../../../data/runs/runs.model";

export function useCloseRun(notify: NotificationFN): (run: NuzlockeRun) => void {
    const navigate = useNavigate()
    return (run: NuzlockeRun) => {
        runsService.closeActiveRun()
        navigate("/")
        notify(`Closed Run ${run.name}`, "info")
    }
}