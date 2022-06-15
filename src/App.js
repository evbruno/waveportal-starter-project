import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

const App = () => {

  const contractAddress = "0x7a1beE5F3DBdF66f4d64dF1C6d22F69da22E5667";
  const contractABI = abi.abi;

  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  const [totalWaves, setTotalWaves] = useState("");

  
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

    setTotalWaves(-1);

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await wavePortalContract.getTotalWaves();
    console.log("Retrieved total wave count...", count.toNumber());
    setTotalWaves(count.toNumber());

    /*
      * Execute the actual wave from your smart contract
    */
    const waveTxn = await wavePortalContract.wave();
    console.log("Mining...", waveTxn.hash);

    await waveTxn.wait();
    console.log("Mined -- ", waveTxn.hash);

    count = await wavePortalContract.getTotalWaves();
    console.log("Retrieved total wave count...", count.toNumber());
    setTotalWaves(count.toNumber());
  } catch (error) {
    console.log(error);
  }
}

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
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
        {totalWaves && (
        <div>
          Total waves is: {totalWaves}
        </div>
        )}

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
      </div>
    </div>
  );
}

export default App