<script lang="ts">
	import { page } from '$app/state';
	import { db } from '$lib/firebase';
	import { doc, getDoc } from 'firebase/firestore';
	import type { CV } from '$lib/types';
	import BlueSidebar from '$lib/templates/BlueSidebar.svelte';
	import MinimalClean from '$lib/templates/MinimalClean.svelte';

	let cv = $state<CV | null>(null);
	let loading = $state(true);

	const id = $derived(page.params.id);

	$effect(() => {
		loadCV();
	});

	async function loadCV() {
		loading = true;
		const snap = await getDoc(doc(db, 'cvs', id));
		if (snap.exists()) cv = { id: snap.id, ...snap.data() } as CV;
		loading = false;
	}

	function print() {
		window.print();
	}
</script>

<svelte:head>
	<title>{cv?.name ?? 'CV'} — Preview</title>
	<style>
		@media print {
			body { margin: 0; }
			.no-print { display: none !important; }
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
