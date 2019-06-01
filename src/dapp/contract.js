import FlightSuretyApp from '../../../FlightSurety/build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

var BigNumber = require('bignumber.js');

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
           
            this.owner = accts[0];

            let counter = 1;
            
            while(this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner}, callback);
    }

    fetchFlightStatus(flight, timestamp, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: timestamp // Math.floor(Date.now() / 1000)
        } 
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }

    buyInsurance(flight, timestamp, value, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: timestamp // Math.floor(Date.now() / 1000)
        } 
        self.flightSuretyApp.methods
            .buyInsurance(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.passengers[0], value:value*(new BigNumber(10)).pow(18)}, (error, result) => {
                callback(error, result);
            });
    }

    pay(flight, timestamp, value, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: timestamp,
            recipient: '0x3bDb2484B838b1b7aD242541543e0144e19a9158' // Math.floor(Date.now() / 1000)
        } 
        self.flightSuretyApp.methods
            .pay(payload.airline, payload.flight, payload.timestamp, payload.recipient)
            .send({from:self.owner}, (error, result) => {
                callback(error, result);
            });
    }
}