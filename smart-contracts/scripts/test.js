const { ethers } = require("ethers");
const dotenv = require("dotenv");

dotenv.config();

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

const main = async () => {

    // get private key from .env
    let deployerprivate = process.env.DEPLOYER_PRIVATE;
    const ALCHAPIKEY = process.env.ALCHAPIKEY;
    const ETHERAPIKEY = process.env.ETHERAPIKEY;
    const INFURAAPIKEY = process.env.INFURAAPIKEY;

    console.log(ALCHAPIKEY);
    // get a web3 provider
    // const provider = await ethers.getDefaultProvider("goerli", { alchemy: ALCHAPIKEY, etherscan: ETHERAPIKEY, infura: INFURAAPIKEY});
    const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.alchemyapi.io/v2/E5Ogmdfcb9fdjqsW3zNW3ab93X8m1Ihy');
    // Turning string into datahexstring
    console.log(deployerprivate);
    deployerprivate = hexToBytes(deployerprivate);

    console.log(deployerprivate);

    deployerprivate = ethers.utils.arrayify(deployerprivate);

    console.log(deployerprivate);

    // Making sure that this is private key is a datahexstring
    console.log(ethers.utils.isBytesLike(deployerprivate));

    // Creating wallet instance
    let address = "0xAd661cb75C262c63cc34A705f8191Ef33AC90412";

    console.log(address);

    address = ethers.utils.arrayify(address);

    console.log(ethers.utils.isBytes(address));

    const Synchrony = new ethers.Wallet(deployerprivate, provider);


    console.log(address);
    
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();