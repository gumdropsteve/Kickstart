import Web3 from 'web3';

const url = 'https://rinkeby.infura.io/v3/20e2adb9c64f4d958b5fd9bdddc45fb8';

let web3;

if (typeof window !== 'undefined' // are we in the browser?
    && typeof window.web3 !== 'undefined') { // is user running metamask?
    web3 = new Web3(window.ethereum); // old: window.web3.currentProvider
} else {
    // we are on the server, or the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        url // make provider from infura url
    );
    web3 = new Web3(provider);
}

export default web3;
