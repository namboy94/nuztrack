import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import {keycloak} from "./util/keycloak";
import axios from "axios";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

keycloak.init({"onLoad": "login-required"}).then(
    () => {
        axios.defaults.baseURL = "http://localhost:8080";
        axios.defaults.headers.common["Authorization"] = "Bearer " + keycloak.token;
        root.render(<App/>)
    }
);
