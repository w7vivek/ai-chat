import { useState,useEffect } from 'react';
import "./compo/UserInterface.css";

import React from 'react'
import UserInterface from "./compo/UserInterface";

function App() {
  const [data,setData]=useState(null);
  const getInput=(data)=>{
    setData(data);
  }

  useEffect(()=>{
    if(data){
    localStorage.setItem("userInput",JSON.stringify(data));}
  },[data]);

  useEffect(()=>{
    const saved=localStorage.getItem("userInput");
    if(saved){
      setData(JSON.parse(saved));
    }
  },[]);
  return (
    <div><UserInterface onSubmitData={getInput}/>
    </div>
  )
}

export default App