// NOTE In this lesson we will learn how to intract with contract same way how we do on remix but without visually means
// if you remember we have button for every function or public variable below depoy tab in remix and we used to write different things to interact with that contract
// the same way we do here but we have to code it first

const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:7545"
  );

  const wallet = new ethers.Wallet(
    "78eb5b5fb3837800dadeaa36a091b7cfc533c8670f97212d833a8f6aee48060a",
    provider
  );

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("wait until contract deploy...");

  const contract = await contractFactory.deploy();
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
