require('dotenv').config();
const { MNEMONIC, PROJECT_ID } = process.env;

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

    contracts_build_directory: "../client/src/contracts",
    networks: {
        development: {
            host: "127.0.0.1", // Localhost (default: none)
            port: 8545, // Standard Ethereum port (default: none)
            network_id: "*", // Any network (default: none)
        },
        goerli: {
            provider: function() {
                return new HDWalletProvider({
                    mnemonic: {
                        phrase: `${process.env.MNEMONIC}`,
                        providerOrUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
                    }
                })
            },
            network_id: 5,

        },
        mumbai: {
            provider: function() {
                return new HDWalletProvider({
                    mnemonic: {
                        phrase: `${process.env.MNEMONIC}`,
                        providerOrUrl: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
                    }
                })
            },
            network_id: 80001,

        },
    },
    mocha: {},
    compilers: {
        solc: {
            version: "0.8.18",
        }
    },
};