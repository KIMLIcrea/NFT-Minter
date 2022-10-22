import { useState } from 'react';
import { ethers } from "ethers";
import makeNFT from "../libs/contracts/MakeNFT.json";

const contractAddress = '0x0A398Ac5A8625d635B0BE050B2b030F84480577a';
const contractABI = makeNFT.abi;

const NFTItem = ({currentAddress, item, setNotify}) => {
  const mintToken = async (tokenId) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        const metadataURI = `https://gateway.pinata.cloud/ipfs/QmW8hg8F226Dau1ggHAqZjkpqn84XvnSE7YdAi2XwnUzDc/${tokenId}.json`
        
        const txn = await nftContract.safeMint(currentAddress, metadataURI, {
          value: ethers.utils.parseEther('0.001'),
        });

        setNotify(previousState => {
          return {
            ...previousState,
            type: 'warning', 
            msg: "⌛Minting..." 
          }
        });

        await txn.wait();

        setNotify(previousState => {
          return {
            ...previousState,
            type: 'success',
            msg: `🥳 Minted, <a class='underline' href='https://mumbai.polygonscan.com/tx/${txn.hash}' target='_blank'>polygonscan</a>` 
          }
        });
      } else {
        setNotify(previousState => {
          return {
            ...previousState,
            type: 'error', 
            msg: "Install a MetaMask wallet to mint an NFT." 
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <a href="#" className="relative block shadow-md">
      <img
        src={require(`../libs/images/${item.edition}.png`)}
        alt={item.name}
        className="h-56 w-full object-contain lg:h-72"
      />
      <div className="p-4">
        <h3 className="my-2 text-lg font-bold">{item.name}</h3>
        <p className="text-sm text-gray-700">{item.description}</p>
        <div className='text-center'>
          <button
            type="button"
            className="mt-4 w-3/5 rounded-md bg-indigo-600 p-3 text-sm text-white font-medium hover:bg-indigo-700"
            onClick={() => mintToken(item.edition)}
          >
            Mint
          </button>
        </div>
      </div>
    </a>
  );
}

export default NFTItem;
