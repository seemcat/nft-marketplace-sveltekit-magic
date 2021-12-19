<script context="module">
	import { browser, dev } from '$app/env';
	import { get } from 'svelte/store';
	import { store as authStore } from '$lib/auth';
	import MintForm from '../components/mint-form.svelte';

	export const hydrate = dev;
	export const router = browser;
	export const prerender = true;

	function load() {
		const user = get(authStore);
		console.log('user: ', user);
		if (!user) {
			return {
				status: 302,
				redirect: '/login'
			};
		}
		return {
			status: 200
		};
	}
	load();

	
</script>

<svelte:head>
	<title>Mint NFT</title>
</svelte:head>

<div class="content">
	<h1>Hi {$authStore.email}!</h1>
		<h1>Mint an NFT here.👇</h1>
	<MintForm />
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}

	h1 {
		text-align: center;
		margin-bottom: var(--column-margin-bottom);
	}
</style>
