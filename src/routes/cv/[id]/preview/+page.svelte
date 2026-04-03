<script lang="ts">
	import { page } from '$app/state';
	import { getCV } from '$lib/cvStore';
	import { getUser, isLoading } from '$lib/authStore.svelte';
	import type { CV } from '$lib/types';
	import BlueSidebar from '$lib/templates/BlueSidebar.svelte';
	import MinimalClean from '$lib/templates/MinimalClean.svelte';

	let cv = $state<CV | null>(null);
	let loading = $state(true);

	const id = $derived(page.params.id);

	$effect(() => {
		if (!isLoading()) loadCV();
	});

	async function loadCV() {
		const user = getUser();
		if (!user) return;
		loading = true;
		cv = await getCV(user.uid, id);
		loading = false;
	}

	function print() {
		window.print();
	}
</script>

<svelte:head>
	<title>{cv?.name ?? 'CV'} — Preview</title>
	<style>
		@page {
			size: A4;
			margin: 0;
		}
		@media print {
			html, body {
				margin: 0;
				padding: 0;
				-webkit-print-color-adjust: exact;
				print-color-adjust: exact;
			}
			.no-print { display: none !important; }
			nav { display: none !important; }
		}
	</style>
</svelte:head>

{#if loading}
	<div class="text-center py-20 text-gray-400">Loading…</div>
{:else if !cv}
	<div class="text-center py-20 text-gray-400">CV not found.</div>
{:else}
	<div class="no-print flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
		<a href="/cv/{cv.id}" class="text-sm text-gray-500 hover:text-gray-700">← Back to editor</a>
		<div class="flex items-center gap-3">
			<span class="text-sm text-gray-700 font-medium">{cv.name}</span>
			<button onclick={print} class="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700">
				Print / Save as PDF
			</button>
		</div>
	</div>

	<div class="bg-gray-200 min-h-screen p-8 flex justify-center print:bg-white print:p-0">
		<div class="shadow-2xl print:shadow-none">
			{#if cv.templateId === 'blue-sidebar'}
				<BlueSidebar data={cv.data} />
			{:else}
				<MinimalClean data={cv.data} />
			{/if}
		</div>
	</div>
{/if}
