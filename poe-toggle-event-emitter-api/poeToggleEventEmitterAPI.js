const Web3 = require('web3');
var express = require("express");

var emitterAPI = express();
emitterAPI.use(express.json());

const emitterConfig = require('./config/poeEmitterConfig.json');
const { web3ProviderURL, web3ProviderPort, contractAddress, contractABI } = emitterConfig;

var port = process.env.PORT || 3000;

const web3 = new Web3('ws://' + web3ProviderURL + ':' + web3ProviderPort)
const lightEmUpContract = new web3.eth.Contract(contractABI, contractAddress);

emitterAPI.post("/togglePoe", function (req, res) {
	if(req.body.poeState.toUpperCase() === 'ON') {
		lightEmUpContract.methods.toggleOn().call()
		.then(() => res.sendStatus(200))
		.catch((err) => {res.status(500).json({error: err}); console.log(err);});
	} else if (req.body.poeState.toUpperCase() === 'OFF') {
		lightEmUpContract.methods.toggleOff().call()
		.then(() => res.sendStatus(200))
		.catch((err) => {res.status(500).json({error: err}); console.log(err);});
	} else {
		res.status(422).json({error: 'Server Expected poeState to be either ON or OFF.'});
	}
});

emitterAPI.listen(port, () => {
	console.log(`POE Event Emitter API is Listening on Port ${port}`);
});
