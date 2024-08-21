const bip39 = require('bip39');
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const bitcoin = require('bitcoinjs-lib');
const axios = require('axios');

// Wrap bip32 with tiny-secp256k1
const bip32 = BIP32Factory(ecc);

// Generate mnemonic
const mnemonic = bip39.generateMnemonic();
console.log('Mnemonic:', mnemonic);

// Derive address
const seed = bip39.mnemonicToSeedSync(mnemonic);
const root = bip32.fromSeed(seed);
const account = root.derivePath("m/44'/1'/0'/0/0"); // Derive first address for testnet
const { address } = bitcoin.payments.p2pkh({ pubkey: account.publicKey, network: bitcoin.networks.testnet });
console.log('Address:', address);

// Define the API token and URL for testnet
const token = 'd97f9902d0f74ef893afac005656781f'; // Replace with your testnet token
const url = `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/full?token=${token}&before=300000`; // URL for testnet

async function getBalance() {
    try {
        console.log('Request URL:', url); // Log the URL to ensure it's correct
        const response = await axios.get(url);
        console.log('Balance fetched successfully:', response.data);
    } catch (error) {
        if (error.response) {
            if (error.response.status === 429) {
                console.error('Rate limit exceeded. Please wait and try again later.');
            } else if (error.response.status === 400) {
                console.error('Bad request. Check the address and API token.');
            } else {
                console.error('Error fetching balance:', error.response.status, error.response.statusText);
            }
        } else {
            console.error('Error fetching balance:', error.message);
        }
    }
}

getBalance();
