<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { applyActionCode } from 'firebase/auth';
	import { auth } from '$lib/firebase';

	let status = $state<'loading' | 'success' | 'error'>('loading');
	let errorMsg = $state('');

	$effect(() => {
		const mode = page.url.searchParams.get('mode');
		const oobCode = page.url.searchParams.get('oobCode');

		if (mode === 'verifyEmail' && oobCode) {
			applyActionCode(auth, oobCode)
				.then(() => {
					status = 'success';
					// redirect to home after short delay so user sees the success message
					setTimeout(() => goto('/'), 2500);
				})
				.catch((e) => {
					status = 'error';
					if (e.code === 'auth/invalid-action-code') {
						errorMsg = 'This verification link has already been used or expired.';
					} else {
						errorMsg = 'Verification failed. Please try again.';
					}
				});
		} else {
			status = 'error';
			errorMsg = 'Invalid or unsupported action link.';
		}
	});
</script>

<svelte:head>
	<title>Email Verification — CV Maker</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
	<div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center">
		<a href="/" class="text-2xl font-bold text-blue-600 block mb-8">CV Maker</a>

		{#if status === 'loading'}
			<div class="text-gray-400 text-sm">Verifying your email…</div>
		{:else if status === 'success'}
			<div class="text-5xl mb-4">✅</div>
			<h2 class="text-xl font-bold text-gray-800 mb-2">Email verified!</h2>
			<p class="text-sm text-gray-500 mb-6">Redirecting you to the app…</p>
			<a href="/" class="bg-blue-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-700">Go to CV Maker</a>
		{:else}
			<div class="text-5xl mb-4">❌</div>
			<h2 class="text-xl font-bold text-gray-800 mb-2">Verification failed</h2>
			<p class="text-sm text-gray-500 mb-6">{errorMsg}</p>
			<a href="/auth" class="bg-blue-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-700">Back to Sign In</a>
		{/if}
	</div>
</div>
