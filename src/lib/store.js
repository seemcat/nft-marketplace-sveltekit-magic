import { writable } from 'svelte/store';

export const nftFormState = writable({
	fileUrl: null,
	formInput: {
		name: '',
		description: '',
		price: ''
	}
});

export const nftGalleryState = writable([]);

export const purchasedNFTs = writable([]);

export const mintedNFTs = writable([]);

export const soldNFTs = writable([]);
