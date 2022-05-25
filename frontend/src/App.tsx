import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Button} from "@mui/material";
import axios from "axios";

import {ReactKeycloakProvider, useKeycloak} from "@react-keycloak/web";
import Keycloak from "keycloak-js";
import {keycloak} from "./Keycloak";
import {stringify} from "querystring";

function App() {



  return (
      <div>
        <Button onClick={testCall} variant={"contained"}>Hello World</Button>
          <Button onClick={whoami} variant={"contained"}>Who Am I</Button>
        <Button onClick={login} variant={"contained"}>Login</Button>
        <Button onClick={logout} variant={"contained"}>Logout</Button>
      </div>
  );
}

function testCall() {
  axios.defaults.baseURL = "http://localhost:8080"
    //axios.defaults.headers = {"Authorization": "Bearer " + keycloak.token}

  axios.get("/api/test", {"headers": {"Authorization": "Bearer " + keycloak.token}})
  axios.get("/api/count", {"headers": {"Authorization": "Bearer " + keycloak.token}}).then((resp) => window.alert(resp.data))

}

function login() {
}

function logout() {

}

function whoami() {
    keycloak.loadUserInfo().then(x => window.alert(stringify(x)))
    window.alert(keycloak.profile)
}



export default App;