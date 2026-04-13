<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { getUser, isLoading, signOut } from '$lib/authStore.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	const isAuthPage = $derived(page.url.pathname === '/auth');
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-gray-50">
	{#if !isAuthPage}
	<nav class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between print:hidden">
		<a href="/" class="text-xl font-bold text-blue-600">CV Maker</a>
		<div class="flex items-center gap-3">
			{#if isLoading()}
				<span class="text-sm text-gray-400">Loading…</span>
			{:else if getUser()}
				{#if getUser()?.photoURL}
					<img src={getUser()?.photoURL} alt="avatar" class="w-7 h-7 rounded-full" />
				{/if}
				<span class="text-sm text-gray-600">{getUser()?.displayName ?? getUser()?.email}</span>
				<button onclick={signOut} class="text-sm text-red-500 hover:text-red-700">Sign out</button>
			{:else}
				<a href="/auth" class="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700">Sign in</a>
			{/if}
		</div>
	</nav>
	{/if}

	{@render children()}
</div>
