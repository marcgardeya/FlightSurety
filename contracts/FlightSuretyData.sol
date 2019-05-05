pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    struct Airline {
        bool isRegistered;

        uint256 funding;
        bool isFunded;

        uint256 votes;
        bool isVoted;
    }

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    mapping(address => uint256) private authorizedContracts;            // Mapping for storing authorized contracts
    mapping(address => Airline) private airlines;                       // Mapping for storing airlines
    uint256 nbParticipatingAirlines;                                    // Number of participating airlines, i.e. registered and funded

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                    address firstAirline
                                ) 
                                public 
    {
        contractOwner = msg.sender;

        // airline has to be funded to be able to register another airline
        airlines[firstAirline] = Airline({isRegistered:true,funding:0,isFunded:false,votes:0,isVoted:true});
        nbParticipatingAirlines = 1;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier requireIsCallerAuthorized()
    {
        require(authorizedContracts[msg.sender] == 1, "Caller is not contract owner");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }

    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner
    {
        operational = mode;
    }

    function authorizeCaller
                            (
                                address contractAddress
                            )
                            external
                            requireContractOwner
    {
        authorizedContracts[contractAddress] = 1;
    }

    function isAirline( address airline ) external view returns(bool) {
        return airlines[airline].isRegistered;
    }

    function isFunded( address airline ) external view returns(bool) {
        return airlines[airline].isFunded;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline
                            (   
                                address newAirline,
                                address registeringAirline
                            )
                            external
                            //requireIsCallerAuthorized
    {
        require(!airlines[newAirline].isRegistered, "Airline is already registered.");
        require(airlines[registeringAirline].isFunded, "Registering airline has to be funded to register another airline");

        airlines[newAirline].isRegistered = true;
        return;

/*
        // add a vote for this airline
        airlines[wallet].votes += 1;

        // register a new airline until there are at least four airlines registered
        if( (nbParticipatingAirlines < 5) ||

        // Registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines
        (airlines[wallet].votes >= nbParticipatingAirlines/2) ) {

            airlines[wallet].isVoted = true;
            nbParticipatingAirlines += 1;
        }
 */
    }


   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy
                            (                             
                            )
                            external
                            payable
    {

    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees
                                (
                                )
                                external
                                pure
    {
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay
                            (
                            )
                            external
                            pure
    {
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function marc( address airline ) external
    {
        airlines[airline].isFunded = true;
    }

    //    nbParticipatingAirlines += 1;
/*
        airlines[msg.sender].funding += msg.value;
        if(airlines[msg.sender].funding >= 1 ether) {
            airlines[msg.sender].isFunded = true;
            nbParticipatingAirlines += 1;
        }
        */
    //}

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    /*
    function() 
                            external 
                            payable 
    {
        fund();
    }
*/

}

