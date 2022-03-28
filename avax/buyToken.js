import { Contract, Wallet, providers, utils } from 'ethers';
import prompt from 'prompt';
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const secret = require("../secret.json");

// secret["private_key"] clé privée de ton wallet
// secret["public_key"] clé publique de ton wallet
let config = {};
let router;

export default function buyToken() {
    prompt.start();
    prompt.get(['contract number'], function(err, result) {
        config = {
            amountToSwap: '0.1', // en AVAX
            gwei: '80',
            slippage: 0, // OSEF du slippage
            gas: {
                gasPrice: () => utils.parseUnits(config.gwei, 'gwei'),
                gasLimit: 2000000
            },
            addresses: {
                AVAX: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",   
                router: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4", // Traderjoe
                target:  secret['public_key']                                    
            }
        }

        config = {
            contractNumber: result['contract number'], ...config
        }
    
        router = new Contract( 
            config.addresses.router,
            ['function swapExactAVAXForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint256[] memory amounts)'],
            new Wallet(secret['private_key'], new providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc"))
          );
    });
    
   //  snipe(router, config);
}

const snipe = async (router, {amountToSwap: amountToSwap, slippage: slippage, addresses: addresses, gas: gas}) => {
    const tx = await router.swapExactAVAXForTokensSupportingFeeOnTransferTokens(
        slippage,
        [addresses.AVAX, token],
        addresses.target,
        Math.floor(Date.now() / 1000) + 60 * 20,
        {
            ...gas,
            value: utils.parseEther(amountToSwap).toHexString()
        }
    );

    console.log('Stardust Revolution');
    const receipt = await tx.wait();
    console.log('Transaction hash', receipt.transactionHash);
}