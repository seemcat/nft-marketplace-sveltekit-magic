<script context="module">
	import NFTGallery from '../components/nft-gallery.svelte';
	import { store as authStore } from '$lib/auth';

	export const prerender = true;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="content">
	<h1>Magical NFTs</h1>
	{#if $authStore}
		<NFTGallery />
	{:else}
		<p>Please log in to view the NFTs.</p>
	{/if}
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}

	h1 {
		width: 100%;
	}

	p {
		width: 75%;
	}
</style>
