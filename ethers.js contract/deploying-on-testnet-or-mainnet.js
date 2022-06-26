// NOTE deploying on Rinkeby testnet
const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

// Main Deploy function
async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_URL_TESTNET
  );

  let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("wait until contract deploy...");

  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);

  const currentFavoriteNumber = await contract.retriveve();
  console.log(` Current Favorite Number: ${currentFavoriteNumber.toString()}`);

  const transactionResponse = await contract.store("7");
  const transactionReceipt = await transactionResponse.wait(1);

  const updatedFavoriteNumber = await contract.retriveve();
  console.log(
    `Updated Favorite Number is: ${updatedFavoriteNumber.toString()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
