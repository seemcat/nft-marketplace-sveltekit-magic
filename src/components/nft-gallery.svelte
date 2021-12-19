<script context="module">
	import { nftGalleryState } from '../lib/store';
	import { onMount } from 'svelte';
	import { nftaddress, nftmarketaddress } from '../../config';

	import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
	import Market from '../../artifacts/contracts/Market.sol/NFTMarket.json';

	import { ethers } from 'ethers';
	import { magicProvider } from '../routes/api/_magic-client';

	export const prerender = true;

	/** @type {import('@sveltejs/kit').Load} */
	export async function loadNFTs() {
		/* create a generic provider and query for unsold market items */
		const tokenContract = new ethers.Contract(nftaddress, NFT.abi, magicProvider);
		const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, magicProvider);
		const data = await marketContract.fetchMarketItems();

		/*
		 *  map over items returned from smart contract and format
		 *  them as well as fetch their token metadata
		 */
		const items = await Promise.all(
			data.map(async (i) => {
				const tokenUri = await tokenContract.tokenURI(i.tokenId);
				const meta = await fetch(tokenUri)
					.then((res) => res.json())
					.then((data) => data);
				let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
				let item = {
					price,
					tokenId: i.tokenId.toNumber(),
					seller: i.seller,
					owner: i.owner,
					image: meta.image,
					name: meta.name,
					description: meta.description
				};

				return item;
			})
		);
		nftGalleryState.set(items);
	}
</script>

<script>
	onMount(async () => {
		await loadNFTs();
	});

	async function buyNft(nft) {
		/* needs the user to sign the transaction, so will use Magic Provider and sign it */
		const signer = magicProvider.getSigner();
		const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

		/* user will be prompted to pay the asking price to complete the transaction */
		const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
		const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
			value: price
		});
		await transaction.wait();
		loadNFTs();
	}
</script>

<section>
	{#if !$nftGalleryState.length}
		<h1>No items in marketplace</h1>
	{:else}
		{#each $nftGalleryState as nft}
			<div class="card">
				<div class="card-image">
					<figure class="image is-4by3">
						<img src={nft.image} alt="NFT" />
					</figure>
				</div>
				<div class="card-content">
					<div class="media">
						<div class="media-content">
							<p class="title is-4">{nft.name}</p>
							<p class="description is-4">{nft.description}</p>
							<p class="subtitle is-6">Price: {nft.price} Eth</p>
							<p class="subtitle is-6">Seller: {nft.seller}</p>
							<p class="subtitle is-6">Owner: {nft.owner}</p>
							<p class="subtitle is-6">Token ID: {nft.tokenId}</p>
						</div>
						<button class="button is-primary" on:click={() => buyNft(nft)}> Buy </button>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</section>

<style>
	.card {
		margin: 1rem;
		box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
		border-radius: 4px;
	}

	.card-image {
		position: relative;
		overflow: hidden;
		border-radius: 4px 4px 0 0;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-content {
		padding: 1rem;
	}

	.card-content p {
		margin: 0;
	}

	.card-content .media-content {
		flex-grow: 1;
	}

	.card-content .media-content p {
		margin-bottom: 0;
	}

	.card-content .media-content p.title {
		font-size: 2rem;
		text-transform: uppercase;
	}

	.card-content .media-content p.description {
		font-size: 1.5rem;
	}

	.card-content .media-content p.subtitle {
		font-size: 0.875rem;
	}

	section {
		display: flex;
		flex-direction: column-reverse;
		justify-content: center;
		flex: 1;
		margin: 30px;
	}

	h1 {
		width: 100%;
	}

	.button {
		margin-top: 20px;
		background: #fafafa;
		border: 1px solid #eaeaea;
		border-radius: 5px;
		padding: 10px;
		cursor: pointer;
	}
</style>
