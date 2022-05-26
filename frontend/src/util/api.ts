import axios from "axios";
import {keycloak} from "./keycloak";

export function get(endpoint: string): Promise<any> {
    return axios.get(endpoint, {"headers": {"Authorization": "Bearer " + keycloak.token}})
}