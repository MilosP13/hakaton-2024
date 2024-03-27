import React, { useState, useEffect } from 'react';
import MapComponent from '../Map/MapComponent';
import './Main.css'; // Import your CSS file
import Web3 from 'web3';
import { DivIcon } from 'leaflet';
const factoryAddress = "0x45901cb33B515E531D648fF908ccD6Bd1D50bDe9";
const sepoliaRPCUrl = "https://sepolia.infura.io/v3/c0d531f5e8474b20b7e66cffe0640b32";

const Main = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);

  const checkMetaMaskConnection = async () => {
    const { ethereum } = window;
    if (ethereum) {
      try {
        if (ethereum._metamask?.isApproved) {
          console.log("A MetaMask request is already pending. Please wait.");
          return;
        }
  
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log("Connected to Ethereum account: ", accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error("Error connecting to MetaMask: ", error);
      }
    } else {
      console.log("MetaMask is not installed.");
    }
  };

  useEffect(() => {
    // Check MetaMask connection status
    checkMetaMaskConnection();
  }, []);

  useEffect(() => {
    const web3Instance = new Web3(sepoliaRPCUrl);
    console.log(web3Instance);
    setWeb3(web3Instance);
    checkMetaMaskConnection();
    console.log("Web3 instance set up: ", web3);
  }, []);

  return (
    <div className="main-container">
      <div>
      <img className="background-image"/>
      <img className="background-image2"/>
      <div className="welcome-information">
        <div className="titlee">
          <h1>Trusted Real Estate <br></br>
          Property For You</h1>
          <img className="img-ether"src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"/>
        </div>
        <div className="subtitle">
        Our reliable blockchain-based real estate purchasing
        system will provide you with security and convenience during the buying process.
        Purchasing has never been easier, faster, or more trustworthy.
        </div>
        {!isConnected && (
        <div className="metamask">
          <button className="connect-button" onClick={checkMetaMaskConnection}>Connect to MetaMask</button>
        </div>
      )}
      </div>
      <img className="img-ether-2"src="https://cryptologos.cc/logos/ethereum-eth-logo.png"/>
      {isConnected && <MapComponent web3={web3} account={account} factoryAddress={factoryAddress} />}  
      </div>
    </div>
  );
};

export default Main;
