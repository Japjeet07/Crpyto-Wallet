const bip39 = require('bip39');
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const bitcoin = require('bitcoinjs-lib');

const bip32 = BIP32Factory(ecc);

const mnemonic = 'hidden sunset dice achieve shoot sausage dose run much smile amount they';
const seed = bip39.mnemonicToSeedSync(mnemonic);
const root = bip32.fromSeed(seed, bitcoin.networks.testnet);

// Function to generate a new address
const generateNewAddress = (index) => {
  const account = root.derivePath(`m/84'/1'/0'/0/${index}`); // BIP84 Testnet derivation path for Bech32 with variable index
  const { address } = bitcoin.payments.p2wpkh({ pubkey: account.publicKey, network: bitcoin.networks.testnet });
  return address;
};

// Example usage
const index = 10; // Change this index to get different addresses
const newAddress = generateNewAddress(index);

console.log('Bech32 Testnet Address:', newAddress);
