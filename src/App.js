import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        🎸 Howdy🤘🏻
        </div>

        <div className="bio">
        I am <strong>not</strong> farza and I <strong>didn't work</strong> on self-driving cars so that's pretty cool right? 
        Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
