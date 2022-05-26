import React from 'react';
import 'bulma/css/bulma.min.css';
import './App.css';
import Dashboard from "../paperbase/Dashboard";
import {BrowserRouter} from "react-router-dom";


export default class App extends React.Component {
  render() {
    return (
        <BrowserRouter>
          <Dashboard/>
        </BrowserRouter>
    )
  }
}
