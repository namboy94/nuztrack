import Keycloak from "keycloak-js";
import axios from "axios";

export const keycloak = new Keycloak({
    "url": "http://localhost:8081/",
    "realm": "Nuztrack",
    "clientId": "React-auth"
})

export function createAxios() {
    const defaultOptions = {
        baseURL: "http://localhost:8080",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + keycloak.token
        },
    };
    return axios.create(defaultOptions)
}