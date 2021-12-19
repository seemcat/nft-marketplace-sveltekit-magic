<script context="module">
	import { soldNFTs } from '../lib/store';
	import { onMount } from 'svelte';
	import { nftaddress, nftmarketaddress } from '../../config';

	import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
	import Market from '../../artifacts/contracts/Market.sol/NFTMarket.json';

	import { ethers } from 'ethers';
	import { magicProvider } from '../routes/api/_magic-client';

	export const prerender = true;
</script>

<script>
	async function loadNFTs() {
		const signer = magicProvider.getSigner();
		const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
		const tokenContract = new ethers.Contract(nftaddress, NFT.abi, magicProvider);
		const data = await marketContract.fetchItemsCreated();

		const items = await Promise.all(
			data.map(async (i) => {
				const tokenUri = await tokenContract.tokenURI(i.tokenId);
				const meta = await fetch(tokenUri)
					.then((res) => res.json())
					.then((data) => {
						return data;
					})
					.catch((error) => {
						console.log(error);
						return [];
					});
				let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
				let item = {
					price,
					tokenId: i.tokenId.toNumber(),
					seller: i.seller,
					owner: i.owner,
					sold: i.sold,
					image: meta.image,
					name: meta.name
				};
				return item;
			})
		);
		/* create a filtered array of items that have been sold */
		const soldItems = items.filter((i) => i.sold);
		soldNFTs.set(soldItems);
	}

	onMount(async () => {
		loadNFTs();
	});
</script>

<section>
	{#if !$soldNFTs.length}
		<h1>No assets sold</h1>
	{:else}
		{#each $soldNFTs as nft}
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
							<p class="subtitle is-6">Price: {nft.price} ETH</p>
						</div>
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
		font-size: 1.25rem;
		text-transform: uppercase;
	}

	.card-content .media-content p.subtitle {
		font-size: 0.875rem;
	}

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		margin: 30px;
	}

	h1 {
		width: 100%;
	}
</style>
