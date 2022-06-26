// NOTE In this lesson will teach you how to use your private key safely

const ethers = require("ethers");
const fs = require("fs-extra");

// SECTION call .env (Environment Variables) to access the information
require("dotenv").config(); // use "process." to access the information in JS

// Main Deploy function
async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

  // ANCHOR we are not using this way to get the wallet
  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // NOTE instead of this we are gonna use our encrypted key
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8");

  // ANCHOR to get the wallet => this function takes (json, password)
  let wallet = ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD // put the password in console like this => PRIVATE_KEY_PASSWORD=password node private-key-management.js

    // NOTE and do "history -c" to clear your git history so no one can see the password from the history
  );

  // ANCHOR now connect the wallet with the provider
  wallet = await wallet.connect(provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  // ANCHOR gathering all the contract info in one place
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("wait until contract deploy...");

  // ANCHOR deploy the contract
  const contract = await contractFactory.deploy();
  // ANCHOR deploy the contract after 1 block conformation
  await contract.deployTransaction.wait(1);

  // ANCHOR calling retrieve() function to get FavoriteNumber
  // NOTE the contract object comes with all the function because of ABI
  const currentFavoriteNumber = await contract.retriveve();
  // console.log(currentFavoriteNumber); // this code return BigNumber like this -   " BigNumber { _hex: '0x00', _isBigNumber: true } "

  // NOTE we can do this to get more readable result
  // console.log(currentFavoriteNumber.toString()); // this will return the number in string form

  // NOTE if you remeber Javascript, then this works as a template string
  // result =>  " Current Favorite Number: 0 "
  console.log(` Current Favorite Number: ${currentFavoriteNumber.toString()}`);

  // ANCHOR update the favoriteNumber by calling Store() function
  // NOTE best practice to pass variable to contract function is in string
  const transactionResponse = await contract.store("7");
  const transactionReceipt = await transactionResponse.wait(1);

  // ANCHOR call updated favoriteNumber
  const updatedFavoriteNumber = await contract.retriveve();
  console.log(
    `Updated Favorite Number is: ${updatedFavoriteNumber.toString()}`
    // Result =>  "Updated Favorite Number is: 7"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Suppose for any reason you don't want to use env file, you can do this NOTE before deploying it from console (not best for key management)

/*  Ex => RPC_URL=http://127.0.0.1:7545 PRIVATE_KEY=78eb5b5fb3837800dadeaa36a091b7cfc533c8670f97212d833a8f6aee48060a node deploy.js
 */

// NOTE Best practice is to encrypt your private key with some password that only you can access, steps to do this task =
// 1. create encryptKey.js file
