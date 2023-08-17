//imports
const { ethers, run, network } = require("hardhat")


//async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    )
    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(`Deployed contract to: ${simpleStorage.address}`)
    
    //Verification
    if (network.config.chainId === 97 && process.env.BSCSCAN_API_KEY) {
      console.log("Waiting for block txes...")  
      await simpleStorage.deployTransaction.wait(6) 
      await verify(simpleStorage.address, [])
    }

    //Contract Interactions:
    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value is: ${currentValue}`)

    // Update the current calue
    const transactionResponse = await simpleStorage.store(5)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated Value is: ${updatedValue}`)
  
    //second time
   // const transactionResponse2 = await simpleStorage.store(10)
   // await transactionResponse2.wait(1)
   // const updatedValue2 = await simpleStorage.retrieve()
   // console.log(`Updated Value is: ${updatedValue2}`)
  }

//Contract Verification
async function verify(contractAddress, args) {  
    console.log("Verifing Contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
          })
    } catch (e) {
      if (e.message.toLowerCase().includes("already been verified")) {
        console.log("Already Verified!")
      } else {
        console.log(e)
      }
    }
}

//main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });