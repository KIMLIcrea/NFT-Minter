import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import makeNFT from "../libs/contracts/MakeNFT.json";

const contractAddress = '0x0A398Ac5A8625d635B0BE050B2b030F84480577a';
const contractABI = makeNFT.abi;

const Header = ({setGlobalAccount, setNotify}) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [nftSupply, setNftSupply] = useState(0);
  const [nftMintPrice, setNftMintPrice] = useState(0);

  window.ethereum.on("chainChanged", () => {
    checkIfWalletIsConnected();
  });

  window.ethereum.on("accountsChanged", () => {
    checkIfWalletIsConnected();
  });

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    }

    // detect network
    let chainId = await ethereum.request({ method: 'eth_chainId' });

    const mumbaiChainId = "0x13881"; 
    if (chainId !== mumbaiChainId) {
      setNotify(previousState => {
        return {
          ...previousState, 
          msg: "You are not connected to the Mumbai Test Network!" 
        }
      });
      return;
    } else {
      setNotify(previousState => {
        return { ...previousState, msg: "" }
      });
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      setIsWalletConnected(true);
      setCurrentAddress(account);
      setGlobalAccount(account);
      getContractInfo();
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Install a MetaMask wallet to mint our NFT Collection.");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];
      setIsWalletConnected(true);
      setCurrentAddress(account);
      setGlobalAccount(account);
      getContractInfo();
    } catch (error) {
      console.log(error);
    }
  }

  const getContractInfo = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contractAddress, contractABI, signer);

      const nftSupply = await nftContract.MAX_SUPPLY();
      const mintPrice = await nftContract.MINT_PRICE();

      setNftSupply(parseInt(nftSupply));
      setNftMintPrice(ethers.utils.formatEther((mintPrice)));
    } catch (error) {
      console.log(error);
    }
  }

  const shortAddress = (addr) => {
    let prefix = addr.substring(0, 5);
    let suffix = addr.substring(addr.length - 4);

    return prefix + "..." + suffix;
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <>
      <header aria-label="Page Header">
        <div className="mx-auto py-8 sm:py-12">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                W3J NFT Minter
              </h1>

              <p className="mt-1.5 text-sm text-gray-500">
                Let's mint a nft that you love! 🚀
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
              <button
                className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                type="button"
                onClick={connectWallet}
              >
                {isWalletConnected ? shortAddress(currentAddress) : 'Connect wallet 🗝️'}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className='text-center'>
        <a
          className="inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] mb-2 focus:outline-none focus:ring active:text-opacity-75"
          href="#"
        >
          <span className="block rounded-full bg-white px-8 py-1 text-sm font-medium">
            Live on Mumbai network
          </span>
        </a> <br/>
        Contract Address: <span className='text-indigo-700'>{contractAddress}</span> <br/>
        NFT Mint Price: <span className='text-indigo-700'>{nftMintPrice}</span> ETH <br/>
        NFT Supply: <span className='text-indigo-700'>{nftSupply}</span>
      </div>
    </>
  );
}

export default Header;
