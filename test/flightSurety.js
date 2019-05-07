
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests', async (accounts) => {

  var config;
  beforeEach('setup contract', async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

    /*
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

  it('(airline) unregistered airline must not be able to register another airline', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

    try {

      // ACT
      await config.flightSuretyApp.registerAirline(newAirline, {from: config.newAirline});
      let result = await config.flightSuretyData.isAirline.call(newAirline); 

      // ASSERT
      assert.equal(result, false, "Unregistered airline must not be able to register another airline");

    } catch(e) {}

  });
*/

  it('data contract - (airline) can be funded', async () => {
      
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    await config.flightSuretyData.marc(config.firstAirline);
    let result = await config.flightSuretyData.isFunded.call(config.firstAirline); 

    // ASSERT
    assert.equal(result, true, "Airline has to be fundable");

  });

  it('data contract - (airline) can not register another airline if not funded', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    try {
      await config.flightSuretyData.registerAirline(newAirline, config.firstAirline );
    } catch(e) {}
    let result = await config.flightSuretyData.isAirline.call(newAirline); 

    // ASSERT
    assert.equal(result, false, "Airline must not be able to register another airline if it hasn't provided funding");

  });

  it('data contract - (airline) can register another airline if funded', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    await config.flightSuretyData.marc(config.firstAirline);
    await config.flightSuretyData.registerAirline(newAirline, config.firstAirline );
    let result = await config.flightSuretyData.isAirline.call(newAirline); 

    // ASSERT
    assert.equal(result, true, "Airline has to be able to register another airline if it has provided funding");

  });

  it('app contract - (airline) can be funded', async () => {
      
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    await config.flightSuretyApp.marc({from: config.firstAirline});
    let result = await config.flightSuretyApp.isFunded.call(config.firstAirline); 
    
    // ASSERT
    assert.equal(result, true, "Airline has to be fundable");

  });

  it('app contract - (airline) can not register another airline if not funded', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    try {
      await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
    } catch(e) {}

    let result = await config.flightSuretyApp.isAirline.call(newAirline); 

    // ASSERT
    assert.equal(result, false, "Airline must not be able to register another airline if it hasn't provided funding");

  });

  it('app contract - (airline) can register another airline if funded', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    await config.flightSuretyApp.marc({from: config.firstAirline});
    await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
    let result = await config.flightSuretyApp.isAirline.call(newAirline); 

    // ASSERT
    assert.equal(result, true, "Airline has to be able to register another airline if it has provided funding");

  });

  /*
  it('(airline) registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines', async () => {
    
    // ARRANGE
    let airline1 = accounts[2];
    let airline2 = accounts[3];
    let airline3 = accounts[4];
    let airline4 = accounts[5];
    let airline5 = accounts[6];

    try {

      // ACT
      await config.flightSuretyData.marc(config.firstAirline);
      await config.flightSuretyData.registerAirline(airline1, {from: config.firstAirline});
      await config.flightSuretyData.registerAirline(airline2, {from: config.firstAirline});
      await config.flightSuretyData.registerAirline(airline3, {from: config.firstAirline});
      await config.flightSuretyData.registerAirline(airline4, {from: config.firstAirline});
      await config.flightSuretyData.registerAirline(airline5, {from: config.firstAirline});

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
      await config.flightSuretyData.marc(airline1);
      await config.flightSuretyData.registerAirline(airline5, {from: airline1});
      await config.flightSuretyData.marc(airline2);
      await config.flightSuretyData.registerAirline(airline5, {from: airline2});
      await config.flightSuretyData.marc(airline3);
      await config.flightSuretyData.registerAirline(airline5, {from: airline3});

      // ASSERT
      {
        let result = await config.flightSuretyData.isAirline.call(airline5); 
        assert.equal(result, true, "Registration of fifth and subsequent airlines must require multi-party consensus");
      }

    } catch(e) {}

  });
*/
});
