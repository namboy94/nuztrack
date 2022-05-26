import React from 'react';
import 'bulma/css/bulma.min.css';
import './App.css';


import {Button, Menu, Navbar} from 'react-bulma-components';
import {Columns} from "react-bulma-components";

import {keycloak} from "../util/keycloak";
import axios from "axios";
import Content from "../paperbase/Content";
import Paperbase from "../paperbase/Paperbase";



function App() {

  return (
      <Paperbase/>
      // <>
      //     <Navbar color={"danger"}>Test</Navbar>
      //     <Menu color={"success"}>Test</Menu>
      // <Columns>
      //
      // </Columns>
      // <Columns>
      //   <Columns.Column>
      //     <Button>A</Button>
      //   </Columns.Column>
      //   <Columns.Column>
      //     <Button>B</Button>
      //   </Columns.Column>
      //   <Columns.Column>
      //     <Button>C</Button>
      //   </Columns.Column>
      //   <Columns.Column>
      //     <Button>D</Button>
      //   </Columns.Column>
      // </Columns>
      // </>
  );
}

function testCall() {
  axios.defaults.baseURL = "http://localhost:8080"
    //axios.defaults.headers = {"Authorization": "Bearer " + keycloak.token}

  axios.get("/api/test", {"headers": {"Authorization": "Bearer " + keycloak.token}})
  axios.get("/api/count", {"headers": {"Authorization": "Bearer " + keycloak.token}}).then((resp) => window.alert(resp.data))

}


export default App;