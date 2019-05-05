
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false);

      let reverted = false;
      try 
      {
          await config.flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true);

  });

  /*
  it('(airline) registered airline can register another airline', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

    try {

      // ACT
      await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
      let result = await config.flightSuretyData.isAirline(newAirline); 

      // ASSERT
      assert.equal(result, true, "Registered airline may register another airline");

    } catch(e) {}

  });

  it('(airline) non-registered airline can not register another airline', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

    try {

      // ACT
      await config.flightSuretyApp.registerAirline(newAirline, {from: config.newAirline});
      let result = await config.flightSuretyData.isAirline.call(newAirline); 

      // ASSERT
      assert.equal(result, false, "Non-registered airline must not register another airline");

    } catch(e) {}

  });

  it('(airline) registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines', async () => {
    
    // ARRANGE
    let airline1 = accounts[2];
    let airline2 = accounts[3];
    let airline3 = accounts[4];
    let airline4 = accounts[5];
    let airline5 = accounts[6];

    try {

      // ACT
      await config.flightSuretyApp.registerAirline(airline1, {from: config.firstAirline});
      await config.flightSuretyApp.registerAirline(airline2, {from: config.firstAirline});
      await config.flightSuretyApp.registerAirline(airline3, {from: config.firstAirline});
      await config.flightSuretyApp.registerAirline(airline4, {from: config.firstAirline});
      await config.flightSuretyApp.registerAirline(airline5, {from: config.firstAirline});

      // ASSERT
      {
        let result = await config.flightSuretyData.isAirline.call(airline4); 
        assert.equal(result, true, "Registered airline may register up to four airlines without multiparty consensus");
      }

      {
        let result = await config.flightSuretyData.isAirline.call(airline5); 
        assert.equal(result, false, "Registered airline may only register up to four airlines without multiparty consensus");  
      }

      // ACT
      await config.flightSuretyApp.registerAirline(airline5, {from: airline1});
      await config.flightSuretyApp.registerAirline(airline5, {from: airline2});
      await config.flightSuretyApp.registerAirline(airline5, {from: airline3});

      // ASSERT
      {
        let result = await config.flightSuretyData.isAirline.call(airline5); 
        assert.equal(result, true, "Registration of fifth and subsequent airlines must require multi-party consensus");
      }

    } catch(e) {}

  });
*/

  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    try {
      await config.flightSuretyData.registerAirline(newAirline, {from: config.firstAirline});
    } catch(e) {

    }
    let result = await config.flightSuretyData.isAirline.call(newAirline); 

    // ASSERT
    assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  it('(airline) can register an Airline using registerAirline() if it is funded', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    try {
      await config.flightSuretyData.fund2(config.firstAirline);
      await config.flightSuretyData.registerAirline(newAirline, {from: config.firstAirline});
    } catch(e) {

    }
    let result = await config.flightSuretyData.isAirline.call(newAirline); 

    // ASSERT
    assert.equal(result, true, "Airline should be able to register another airline if it has provided funding");

  });
 
});
