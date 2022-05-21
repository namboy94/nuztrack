import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Button} from "@mui/material";
import axios from "axios";

function App() {
  return (
    <Button onClick={testCall} variant={"contained"}>Hello World</Button>
  );
}

function testCall() {
  axios.defaults.baseURL = "http://0.0.0.0:8080"
  axios.get("/api/test")
  axios.get("/api/count").then((resp) => window.alert(resp.data))
}

export default App;
