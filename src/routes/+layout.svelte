<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { getUser, isLoading, signOut, resendVerificationEmail, reloadUser } from '$lib/authStore.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { children } = $props();

	const isAuthPage = $derived(page.url.pathname === '/auth');
	const user = $derived(getUser());
	const needsVerification = $derived(
		!!user && !user.emailVerified && user.providerData[0]?.providerId === 'password'
	);

	let resendMsg = $state('');
	let resending = $state(false);
	let checking = $state(false);

	async function handleResend() {
		resending = true;
		try {
			await resendVerificationEmail();
			resendMsg = 'Verification email sent!';
		} catch {
			resendMsg = 'Failed to send. Try again.';
		} finally {
			resending = false;
			setTimeout(() => (resendMsg = ''), 4000);
		}
	}

	async function handleCheckVerified() {
		checking = true;
		await reloadUser();
		checking = false;
		if (getUser()?.emailVerified) {
			goto('/');
		}
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-gray-50">
	{#if !isAuthPage}
	<nav class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between print:hidden">
		<a href="/" class="text-xl font-bold text-blue-600">CV Maker</a>
		<div class="flex items-center gap-3">
			{#if isLoading()}
				<span class="text-sm text-gray-400">Loading…</span>
			{:else if user}
				{#if user.photoURL}
					<img src={user.photoURL} alt="avatar" class="w-7 h-7 rounded-full" />
				{/if}
				<span class="text-sm text-gray-600">{user.displayName ?? user.email}</span>
				<button onclick={signOut} class="text-sm text-red-500 hover:text-red-700">Sign out</button>
			{:else}
				<a href="/auth" class="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700">Sign in</a>
			{/if}
		</div>
	</nav>
	{/if}

	{#if needsVerification && !isAuthPage}
		<div class="bg-yellow-50 border-b border-yellow-200 px-6 py-3 print:hidden">
			<div class="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
				<p class="text-sm text-yellow-800 flex-1">
					<strong>Please verify your email</strong> — check your inbox for a verification link before you can use CV Maker.
				</p>
				<div class="flex items-center gap-3 shrink-0">
					{#if resendMsg}
						<span class="text-xs text-yellow-700">{resendMsg}</span>
					{/if}
					<button onclick={handleResend} disabled={resending} class="text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-900 px-3 py-1.5 rounded disabled:opacity-50">
						{resending ? 'Sending…' : 'Resend email'}
					</button>
					<button onclick={handleCheckVerified} disabled={checking} class="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded disabled:opacity-50">
						{checking ? 'Checking…' : "I've verified"}
					</button>
				</div>
			</div>
		</div>

		<div class="max-w-4xl mx-auto px-6 py-20 text-center text-gray-400">
			Verify your email to continue.
		</div>
	{:else}
		{@render children()}
	{/if}
</div>
