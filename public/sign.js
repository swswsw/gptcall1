//import './main.css';

// Load web3.js from CDN
const script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/gh/ethereum/web3.js@1.3.0/dist/web3.min.js";
document.head.appendChild(script);

let contractABI = null;
let contractBytecode = null;

const contractAddress = '0x68555eEa4dfddbdcf4119872094ca384E04Ae9b7';  // Ensure this is the correct contract address
let contractAddressNum = document.getElementById('contractAddress');

contractAddressNum.textContent = 'Contract Address: ' + contractAddress;

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

document.getElementById('signButton').addEventListener('click', async () => {
    if (!contractABI || !contractBytecode) {
        alert('Contract ABI or Bytecode not loaded.');
        return;
    }

    


    // Check if MetaMask is installed and connected to the correct network
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            // Validate the account and contractAddress
            if (typeof account !== 'string' || typeof contractAddress !== 'string') {
                throw new Error('Invalid account or contract address');
            }

            // Get the network information
            const chainId = await ethereum.request({ method: 'eth_chainId' });
            if (chainId === '0x1f') { // Rootstock Testnet has chain ID 31 (0x1f in hex)

                // Initialize Web3 using MetaMask's provider
                const web3 = new Web3(window.ethereum);

                const contract = new web3.eth.Contract(contractABI, contractAddress);

                // Get the current gas price
                const gasPrice = await web3.eth.getGasPrice();

                // Create the transaction data for the sign function
                const data = contract.methods.sign().encodeABI();

                // Estimate the gas required
                const estimatedGas = await web3.eth.estimateGas({
                    from: account,
                    to: contractAddress,
                    data: data
                });

                // Create the transaction object
                const tx = {
                    from: account,
                    to: contractAddress,
                    gas: estimatedGas.toString(),
                    gasPrice: gasPrice.toString(),
                    data: data,
                };

                // Send the transaction through MetaMask
                const transactionHash = await ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [tx],
                });

                console.log('Transaction sent! Hash:', transactionHash);
                alert('Transaction sent! Hash: ' + transactionHash);

                // Poll for the transaction receipt
                const checkReceipt = async () => {
                    const receipt = await web3.eth.getTransactionReceipt(transactionHash);
                    if (receipt) {
                        if (receipt.status) {
                            console.log('Contract successfully signed:', receipt);
                            alert('Contract successfully signed!');
                        } else {
                            console.log('Transaction failed:', receipt);
                            alert('Transaction failed.');
                        }
                    } else {
                        // If receipt is not available, keep polling
                        setTimeout(checkReceipt, 2000); // Check again after 2 seconds
                    }
                };

                // Start polling for the receipt
                checkReceipt();

            } else {
                alert('Please connect to the Rootstock Testnet (chain ID 31).');
                document.getElementById('network').innerText = 'Network: Unsupported';
            }
        } catch (error) {
            console.error('Error sending transaction:', error);
            alert('Error sending transaction: ' + error.message);
        }
    } else {
        alert('MetaMask not detected. Please install MetaMask extension.');
    }
});



