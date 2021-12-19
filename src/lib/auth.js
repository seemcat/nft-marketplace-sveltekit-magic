import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { magicClientSDK } from '../routes/api/_magic-client';

export const store = writable(null);

export async function login(email) {
	const didToken = await magicClientSDK.auth.loginWithMagicLink({ email });

	// Validate the did token on the server
	const res = await fetch('/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${didToken}`
		},
		body: JSON.stringify(email)
	});

	if (res.ok) {
		const { user } = await res.json();
		store.set(user);
	} else {
		console.error('login failed');
	}
}

export async function logout() {
	await fetch('/api/logout');
	store.set(null);
	goto('/login', { replace: true });
}
