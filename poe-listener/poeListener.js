const axios = require('axios');
const Web3 = require('web3');

const listenerConfig = require('./config/listenerConfig.json');
const {poeAPIURL, poeAPIPort, web3ProviderURL, web3ProviderPort, contractAddress, contractABI} = listenerConfig;

const web3 = new Web3('ws://' + web3ProviderURL + ':' + web3ProviderPort);
web3.eth.net.isListening()
	.then((isUp) => {
            console.log('Web3 is Up: ' + isUp);
            if(isUp) {
                listenForEvents();
            } else {
                console.error('Web3 is not up. Shutting down.');
                process.exit(1);
            }
        }).catch((web3Err) => {
            console.log('Web3 failed to Connect. Shutting down.\n' + web3Err);
            process.exit(1);
        });

async function listenForEvents(){
	// Grab the Web3 Instance of the Contract
	const lightEmUpContract = new web3.eth.Contract(contractABI, contractAddress);

	// Handle the Toggle On Event
	//   Catch the event and invoke a REST call to toggle the POE on.
	lightEmUpContract.events.ToggleOn()
		.on('data', (event) => {
				console.log("Toggle On Caught");
				console.log(event);
				axios.get('http://' + poeAPIURL + ':' + poeAPIPort + '/on')
				.then(response => {
					console.log(response.data);
					})
				.catch(error => {
					console.log(error);
					});
				})
	.on('error', console.error);

	// Handle the Toggle Off Event
	//   Catch the event and invoke a REST call to toggle the POE off.
	lightEmUpContract.events.ToggleOff()
		.on('data', (event) => {
				console.log("Toggle Off Caught");
				console.log(event);
				axios.get('http://' + poeAPIURL + ':' + poeAPIPort + '/off')
				.then(response => {
					console.log(response.data);
					})
				.catch(error => {
					console.log(error);
					});
				})
	.on('error', console.error);
}

