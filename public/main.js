//import './main.css';

// Load web3.js from CDN
const script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/gh/ethereum/web3.js@1.3.0/dist/web3.min.js";
document.head.appendChild(script);

let contractABI = null;
let contractBytecode = null;

async function loadContractData() {
  try {
    // Fetch the contract ABI
    const abiResponse = await fetch('./contractABI.json');
    contractABI = await abiResponse.json();

    // Fetch the contract bytecode
    const bytecodeResponse = await fetch('./contractBytecode.txt');
    contractBytecode = await bytecodeResponse.text();

    // Ensure bytecode is prefixed with '0x'
    if (!contractBytecode.startsWith('0x')) {
      contractBytecode = '0x' + contractBytecode.trim();
    }
  } catch (error) {
    console.error('Error loading contract data:', error);
    alert('Failed to load contract ABI or Bytecode.');
  }
}

// Call the function to load contract data
loadContractData();

// Function to handle connecting to MetaMask
document.getElementById('connectButton').addEventListener('click', async () => {
  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      const account = accounts[0];
      document.getElementById('account').innerText = 'Account: ' + account;

      const chainId = await ethereum.request({ method: 'eth_chainId' });
      if (chainId === '0x1f') {
        document.getElementById('network').innerText = 'Network: Rootstock Testnet';

        // Get the balance in tRBTC
        const balanceInHex = await ethereum.request({
          method: 'eth_getBalance',
          params: [account, 'latest']
        });

        // Convert hex balance to BigInt, then to tRBTC
        const weiValue = BigInt(balanceInHex);
        const tRBTCValue = Number(weiValue) / Math.pow(10, 18);

        document.getElementById('balance').innerText = 'Balance: ' + tRBTCValue.toFixed(6) + ' tRBTC';
      } else {
        alert('Please connect to the Rootstock Testnet (chain ID 31).');
        document.getElementById('network').innerText = 'Network: Unsupported';
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to MetaMask: ' + error.message);
    }
  } else {
    alert('MetaMask not detected. Please install MetaMask extension.');
  }
});

document.getElementById('deployButton').addEventListener('click', async () => {
  if (!contractABI || !contractBytecode) {
    alert('Contract ABI or Bytecode not loaded.');
    return;
  }

  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      // Get the network information
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      if (chainId === '0x1f') { // Rootstock Testnet has chain ID 31 (0x1f in hex)

        // Initialize Web3 using MetaMask's provider
        const web3 = new Web3(window.ethereum);

        //console.log('ABI: ', contractABI)
        //console.log('BYTE: ', contractBytecode)
        // Create a contract instance
        const contract = new web3.eth.Contract(contractABI);

        // Set the constructor arguments
        const counterParty = '0x4bA8db23f3FC49e169550F64A17f04EFe3E482cE'; // example address
        const generatedContractURL = 'testBlobHash'; // example blob data

        // Prepare contract deployment data
        const deployData = contract.deploy({
          data: contractBytecode,  // Ensure the bytecode is prefixed with '0x'
          arguments: [counterParty, generatedContractURL]  // Pass constructor arguments
        }).encodeABI();

        // Get the current gas price and nonce
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(account, 'latest');

        // Estimate the gas required
        const gasEstimate = await web3.eth.estimateGas({
          from: account,
          data: deployData
        });

        console.log('Gas Price: ', gasPrice)
        console.log('Gas Estimate: ', gasEstimate)

        console.log('Contract deployment in progress...')

        // Prepare the transaction object
        const tx = {
          from: account,
          to: null,  // Null when deploying a contract
          gas: Math.floor(gasEstimate * 1.2),  // Add some buffer to the gas estimate
          gasPrice: gasPrice,
          data: deployData,
          nonce: nonce
        };

        // Send the transaction using MetaMask (MetaMask will handle signing)
        const receipt = await web3.eth.sendTransaction(tx);

        // Display the contract address after deployment
        console.log('Contract deployed at address:', receipt.contractAddress);
        document.getElementById('contractAddress').innerText = 'Contract Address: ' + receipt.contractAddress;

      } else {
        alert('Please connect to the Rootstock Testnet (chain ID 31).');
        document.getElementById('network').innerText = 'Network: Unsupported';
      }
    } catch (error) {
      console.error('Error deploying contract:', error);
      alert('Error deploying contract: ' + error.message);
    }
  } else {
    alert('MetaMask not detected. Please install MetaMask extension.');
  }
});

