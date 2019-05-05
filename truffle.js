var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "margin chicken gasp menu credit miss above smile federal tomorrow project crumble";

module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
      },
      network_id: '*'
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  }
};