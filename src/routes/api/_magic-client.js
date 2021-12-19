import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';

const customNodeOptions = {
	rpcUrl: 'http://127.0.0.1:8545/'
};

export const magicClientSDK = new Magic(import.meta.env.VITE_MAGIC_PUBLIC_KEY, {
	network: customNodeOptions
});

export const magicProvider = new ethers.providers.Web3Provider(magicClientSDK.rpcProvider);
