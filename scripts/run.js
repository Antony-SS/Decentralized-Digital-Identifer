const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners(); // 
  const identifierContractFactory = await hre.ethers.getContractAt('ERC721Identifier');
  const identifierContract = await identifierContractFactory.deploy('Synchrony Digital ID Collection', 'symbol things', 'antonyssandboxuriprefix');
  await identifierContract.deployed();
  console.log("Contract deployed to:", identifier.address);
  console.log("Contract delployed by:", owner.address);

  // if we have functions, we must "test" them...
  // Question: do we have to test just public functions?

  console.log("Does owner have minter role: %s", identiferContract.hasRole(MINTER_ROLE, owner.address));
  let identiferCount;
  identiferCount = await identifierContract.totalSupply();
  console.log(identiferCount.toNumber());
  let waveTxn = await identifierContract.mint(randomPerson);
  await waveTxn.wait();

  identiferCount = await identifierContract.totalSupply();
  console.log(identiferCount.toNumber());

  // now we will simulate other ppl connecting to our contract and using doSomething

  waveTxn = await identifierContract.connect(randomPerson).mint(owner);
  await waveTxn.wait();

  identiferCount = await identifierContract.totalSupply();
  console.log(identifierCount.toNumber());

  
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();