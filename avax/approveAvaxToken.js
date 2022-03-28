// ------ Modules ------ //
import { Contract, Wallet, providers, utils } from 'ethers';
import prompt from 'prompt';

// ----- Since import es6 methods doesn't work with json files...
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const secret = require("../secret.json");
// --------------------- //

let config = {};
let router;


export default function approveAvaxToken() {
    prompt.start();
    prompt.get(['token number'], function(err, result) {
        if(err) {
            throw err;
        }

        config = {
            amount: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
            destination: '0x60ae616a2155ee3d9a68541ba4544862310933d4',
            gwei: '80',
            gas: {
                gasPrice: () => utils.parseUnits(config.gwei, 'gwei'),
                gasLimit: 2000000
            },
            addresses: {
                AVAX: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",   
                router: () => config.tokenNumber, // Traderjoe
                target: () => config.destination
            }
        }

        config = { tokenNumber: result['token number'], ...config };

        router = new Contract( 
            config.addresses.router(),
            ['function approve(address spender, uint amount) external payable returns (uint256[] memory amounts)'],
            new Wallet(secret['private_key'], new providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc"))
        )
    });

    // snipe(router, config);
}

const snipe = async (router, {target: target, amount: amount, gas: gas}) => {
    const tx = await router.approve(target(), amount, {...gas});

    console.log('Stardust Revolution');
    const receipt = await tx.wait();
    console.log('Transaction hash', receipt.transactionHash);
}

/*const snipe = async () => {
    
  const tx = await router.approve(
    addresses.target,
    config.amount,
    {
        ...config.gas
    }
  );
  console.log(`Stardust Revolution !`);
  const receipt = await tx.wait();
  console.log(`Transaction hash: ${receipt.transactionHash}`);
}*/


