// const path = require("path");

// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // to customize your Truffle configuration!
//   contracts_build_directory: path.join(__dirname, "client/src/contracts"),
//   networks: {
//     develop: {
//       port: 8545
//     }
//   }
// };

const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "/build/contracts"),
  rpc: {
     host:"127.0.0.1",
     port:8000
     },
  networks: {
      develop: {
       host:"127.0.0.1",
       port: 8000,
       network_id: "*",
       gas:3600000
      }
  },
  compilers: {
      solc: {
      version: "^0.8.0"
      }
  }
};
