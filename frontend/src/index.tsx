import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import {keycloak} from "./util/keycloak";
import axios from "axios";
import {BACKEND_URL} from "./util/config";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
console.log(process.env.BACKEND_URL)

keycloak.init({"onLoad": "login-required"}).then(
    () => {
        axios.defaults.baseURL = BACKEND_URL;
        axios.defaults.headers.common["Authorization"] = "Bearer " + keycloak.token;
        root.render(<App/>)
    }
);
