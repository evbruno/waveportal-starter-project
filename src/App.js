import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

const App = () => {

  // v3
  const contractAddress = "0xDCdC1B699b4a5B073D7304963e54dC21F78A0Ed0";
  const contractABI = abi.abi;

  const [formMsg, setFormMsg] = useState("");

  const handleChange = e => {
    setFormMsg(e.target.value)
  }

  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  
  /*
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);
  
  // const [totalWaves, setTotalWaves] = useState(undefined);

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();

        console.log("Waves loaded from contratct: ", waves.length);
        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      /*
      * First make sure we have access to window.ethereum
      */
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
        * Check if we're authorized to access the user's wallet
        */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /** 
  * Implement your connectWallet method here
  */
 const connectWallet = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    console.log("Connected", accounts[0]);
    setCurrentAccount(accounts[0]);
  } catch (error) {
    console.log(error)
  }
}

const wave = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Ethereum object doesn't exist!");
      return;
    }

    // setTotalWaves(-1);

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await wavePortalContract.getTotalWaves();
    console.log("Retrieved total wave count...", count.toNumber());
    // setTotalWaves(count.toNumber());

    /*
      * Execute the actual wave from your smart contract
    */
    //const waveTxn = await wavePortalContract.wave();
    const waveTxn = await wavePortalContract.wave(formMsg)

    console.log("Mining...", waveTxn.hash);

    await waveTxn.wait();
    console.log("Mined -- ", waveTxn.hash);

    count = await wavePortalContract.getTotalWaves();
    console.log("Retrieved total wave count...", count.toNumber());
    // setTotalWaves(count.toNumber());

    getAllWaves();
  } catch (error) {
    console.log(error);
  }
}

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="guitar">🎸</span> 
          Howdy
        </div>

        <div className="bio">
        I am <strong>not</strong> farza and I <strong>didn't work</strong> on self-driving cars so that's pretty cool right? 
        Connect your Ethereum wallet and wave at me!
        </div>
        {/**totalWaves && (
        <div>
          Total waves is: {totalWaves}
        </div>
        )**/}

        <input 
          className="waveInputMsg" 
          type="text" 
          value={formMsg}
          placeholder="Write your message"
          onChange={handleChange} />

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {!allWaves.length && (
          <div className="bio">
            <strong>No waves at the moment 
              <span role="img" aria-label="scream">😱</span>
            </strong>
          </div>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App