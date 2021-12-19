<script context="module">
	import { browser, dev } from '$app/env';
	import PurchasedNFTs from '../components/purchased-nfts.svelte';
	import SoldNFTs from '../components/sold-nfts.svelte';
	import MintedNFTs from '../components/minted-nfts.svelte';
	import { ethers } from 'ethers';

	import { store as authStore } from '$lib/auth';
	import { magicProvider } from './api/_magic-client';

	export const hydrate = dev;
	export const router = browser;
	export const prerender = true;
</script>

<script>
	const user = $authStore;
	let signer = "";
	let network = "";
	let userAddress = "";
	let userBalance = "";

	const render = async () => {
		if (user) {
			/* Get user's wallet info */
			signer = magicProvider.getSigner();
			network = await magicProvider.getNetwork();
			userAddress = await signer.getAddress();
			userBalance = ethers.utils.formatEther(await magicProvider.getBalance(userAddress));
			console.log('signer: ', signer);
			console.log('network: ', network);
		} else {
			console.log('user is not logged in');
		}
	};
	render();
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div class="content">
	<h1>Wallet Info</h1>
	User Address: {userAddress}<br />
	User Balance: {userBalance}<br />
	<h1>NFTs Sold</h1>
	<SoldNFTs />
	<h1>NFTs Purchased</h1>
	<PurchasedNFTs />
	<h1>NFTs Minted</h1>
	<MintedNFTs />
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
