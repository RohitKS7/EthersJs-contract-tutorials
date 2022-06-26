// ANCHOR Purpose of this script =
// we are gonna set this script to run the encryptKey one time and then we can remove that private key from everywhere so that nowhere it remains in Plain Text

const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  //   NOTE this encrypt() function returns a encrypted Json Key which we can use locally and which can only decrypt with a password
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PRIVATE_KEY
  ); //this function takes 2 parameters = 1. privateKey, 2. Password

  console.log(encryptedJsonKey); //encryption complete
  fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey); // Storing the Encrpted Json result in new json file
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
