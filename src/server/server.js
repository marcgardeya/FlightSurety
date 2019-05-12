import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';

var BigNumber = require('bignumber.js');

let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let accounts = web3.eth.accounts;
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);

// Upon startup, 20+ oracles are registered and their assigned indexes are persisted in memory
let fee = flightSuretyApp.REGISTRATION_FEE;
let oracleIndexes = new Array();

for(let a=1; a<3; a++) {      
  flightSuretyApp.methods
  .registerOracle()
  .send({ from: accounts[a], value: fee * (new BigNumber(10)).pow(18) }, (error, result) => {
    console.log("Error =", error)
    console.log("Result =", result)

    flightSuretyApp.methods
    .getMyIndexes()
    .call({from: accounts[a]}, (error, result) => { 
      oracleIndexes[a] = result; 
      console.log('Oracle indexes: ', oracleIndexes)
    })

    console.log('oracles registered: ', a)
  });
}


flightSuretyApp.events.OracleRequest({
    fromBlock: 0
  }, function (error, event) {
    if (error) console.log('Error =', error)
    console.log('Event =', event)
    
    // Server will loop through all registered oracles,
    // identify those oracles for which the OracleRequest event applies,
    // and respond by calling into FlightSuretyApp contract 
    // with random status code of Unknown (0), On Time (10) or Late Airline (20), Late Weather (30), Late Technical (40), or Late Other (50)
    for(let a=1; a<20; a++) {
      //flightSuretyApp.methods.submitOracleResponse.call(oracleIndexes[a], event.returnValues('airline'), event.returnValues('flight'), event.returnValues('timestamp'), 10);
    }
});


const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
})

export default app;


