<script context="module">
	import { nftFormState } from '../lib/store';
	import { goto } from '$app/navigation';
	import { nftaddress, nftmarketaddress } from '../../config';

	import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
	import Market from '../../artifacts/contracts/Market.sol/NFTMarket.json';

	import { create as ipfsHttpClient } from 'ipfs-http-client';
	import { ethers } from 'ethers';
	import { magicProvider } from '../routes/api/_magic-client';

	export const prerender = true;
</script>

<script>
	const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');
	let avatar, fileinput;
	
	const onFileSelected = async (e) => {
		let image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			avatar = e.target.result;
		};

		try {
			const added = await client.add(image, {
				progress: (prog) => {
					console.log(`received: ${prog}`);
				}
			});
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;
			nftFormState.update((state) => {
				return {
					...state,
					fileUrl: url
				};
			});
		} catch (err) {
			console.error('Error uploading file: ', err);
		}
	};

	async function createSale(url) {
		const signer = magicProvider.getSigner();

		/* next, create the item */
		let nftContract = new ethers.Contract(nftaddress, NFT.abi, signer);
		let transaction = await nftContract.createToken(url);
		let tx = await transaction.wait();
		let event = tx.events[0];

		const receipt = await event.getTransactionReceipt();
		const hexToInt = parseInt(receipt.logs[0].topics[3]);
		const tokenId = parseInt(hexToInt);
		const price = ethers.utils.parseUnits($nftFormState.formInput.price, 'ether');

		// then list the item for sale on the marketplace
		let nftMarketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
		let listingPrice = await nftMarketContract.getListingPrice();
		listingPrice = listingPrice.toString();

		transaction = await nftMarketContract.createMarketItem(nftaddress, tokenId, price, {
			value: listingPrice
		});

		await transaction.wait();
		$nftFormState.formInput.name = '';
		$nftFormState.formInput.description = '';
		$nftFormState.formInput.price = '';
		console.log('Sale created!')
		goto('/', { replace: true });
	}

	async function createMarket() {
		if (
			!$nftFormState.formInput.name ||
			!$nftFormState.formInput.description ||
			!$nftFormState.formInput.price ||
			!$nftFormState.fileUrl
		)
			return;

		/* first, upload to IPFS */
		const data = JSON.stringify({
			name: $nftFormState.formInput.name,
			description: $nftFormState.formInput.description,
			image: $nftFormState.fileUrl
		});

		try {
			const added = await client.add(data);
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;

			/* after file is uploaded to IPFS, pass the URL to save it on Polygon */
			createSale(url);
		} catch (error) {
			console.log('Error uploading file: ', error);
		}
	}
</script>

<svelte:head>
	<title>Mint NFT Form</title>
</svelte:head>

<section>
	{#if avatar}
		<img class="avatar" src={avatar} alt="d" />
	{:else}
		<img
			class="avatar"
			src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"
			alt=""
		/>
	{/if}
	<img
		class="upload"
		src="https://static.thenounproject.com/png/625182-200.png"
		alt=""
		on:click={() => {
			fileinput.click();
		}}
	/>
	<div
		class="chan"
		on:click={() => {
			fileinput.click();
		}}
	>
		Choose Image
	</div>
	<input
		style="display:none"
		type="file"
		accept=".jpg, .jpeg, .png"
		on:change={(e) => onFileSelected(e)}
		bind:this={fileinput}
	/>

	<form class="content">
		<label>Name</label>
		<input type="text" bind:value={$nftFormState.formInput.name} />
		<label>Description</label>
		<input type="text" bind:value={$nftFormState.formInput.description} />
		<label>Price</label>
		<input type="text" bind:value={$nftFormState.formInput.price} />
	</form>
	<button on:click={() => createMarket()}>Create</button>
</section>

<style>
	.avatar {
		height: 200px;
		border: 1px solid #ccc;
		margin: 30px;
		display: block;
	}

	.upload {
		width: 100px;
	}

	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		max-width: 600px;
		padding: 0 20px;
	}

	h1 {
		width: 100%;
	}

	p {
		width: 75%;
	}

	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 0 auto;
		max-width: 600px;
		padding: 0 20px;
	}

	.content label {
		width: 100%;
		margin-bottom: 10px;
	}

	.chan {
		margin-bottom: 20px;
		margin-top: 20px;
		background: #fafafa;
		border: 1px solid #eaeaea;
		border-radius: 5px;
		padding: 10px;
		cursor: pointer;
	}

	button {
		margin-top: 20px;
		background: #fafafa;
		border: 1px solid #eaeaea;
		border-radius: 5px;
		padding: 10px;
		cursor: pointer;
	}
</style>
