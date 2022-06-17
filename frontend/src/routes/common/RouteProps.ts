import {NotificationFN} from "../../components/Snackbar";
import {NuzlockeRun} from "../../data/runs/runs.model";

export interface RouteProps {
    notify: NotificationFN
}

export interface RunRouteProps {
    notify: NotificationFN,
    run: NuzlockeRun
}