<script lang="ts">
	import { getUser, isLoading } from '$lib/authStore.svelte';
	import { getCVs, createCV, deleteCV, duplicateCV } from '$lib/cvStore';
	import type { CV, TemplateId } from '$lib/types';
	import { goto } from '$app/navigation';

	let cvs = $state<CV[]>([]);
	let fetching = $state(false);
	let showCreate = $state(false);
	let newName = $state('');
	let newTemplate = $state<TemplateId>('blue-sidebar');
	let creating = $state(false);

	async function load() {
		const user = getUser();
		if (!user) return;
		fetching = true;
		cvs = await getCVs(user.uid);
		fetching = false;
	}

	$effect(() => {
		if (!isLoading()) {
			if (getUser()) load();
			else goto('/auth');
		}
	});

	// Reload list when tab becomes visible again (e.g. returning from editor)
	$effect(() => {
		function onVisible() {
			if (document.visibilityState === 'visible' && getUser()) load();
		}
		document.addEventListener('visibilitychange', onVisible);
		return () => document.removeEventListener('visibilitychange', onVisible);
	});

	async function handleCreate() {
		const user = getUser();
		if (!user || !newName.trim()) return;
		creating = true;
		const id = await createCV(user.uid, newName.trim(), newTemplate);
		creating = false;
		showCreate = false;
		newName = '';
		goto(`/cv/${id}`);
	}

	async function handleDelete(id: string) {
		const user = getUser();
		if (!user || !confirm('Delete this CV?')) return;
		await deleteCV(user.uid, id);
		cvs = cvs.filter((c) => c.id !== id);
	}

	async function handleDuplicate(id: string) {
		const user = getUser();
		if (!user) return;
		const newId = await duplicateCV(user.uid, id);
		await load();
		goto(`/cv/${newId}`);
	}

	const templateLabels: Record<TemplateId, string> = {
		'blue-sidebar': 'Blue Sidebar',
		'minimal-clean': 'Minimal Clean'
	};
</script>

<main class="max-w-4xl mx-auto px-6 py-10">
	{#if isLoading() || !getUser()}
		<div class="text-center py-20 text-gray-400">Loading…</div>
	{:else}
		<div class="flex items-center justify-between mb-8">
			<h1 class="text-2xl font-bold text-gray-800">My CVs</h1>
			<button onclick={() => (showCreate = true)} class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
				+ New CV
			</button>
		</div>

		{#if fetching}
			<div class="text-center py-16 text-gray-400">Loading CVs…</div>
		{:else if cvs.length === 0}
			<div class="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
				<p class="text-gray-400 mb-4">No CVs yet. Create your first one!</p>
				<button onclick={() => (showCreate = true)} class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
					Create CV
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each cvs as cv}
				<div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
					<div class="flex items-start justify-between mb-3">
						<div>
							<h3 class="font-semibold text-gray-800">{cv.name}</h3>
							<span class="text-xs text-gray-400 mt-0.5 block">{templateLabels[cv.templateId]}</span>
						</div>
						<button onclick={() => handleDelete(cv.id)} class="text-gray-300 hover:text-red-400 transition text-lg leading-none" title="Delete">✕</button>
					</div>
					<div class="text-xs text-gray-400 mb-4">
						Updated {new Date(cv.updatedAt).toLocaleDateString()}
					</div>
					<div class="flex gap-2">
						<a href="/cv/{cv.id}" class="flex-1 text-center bg-blue-600 text-white text-sm py-1.5 rounded-lg hover:bg-blue-700 transition">Edit</a>
						<a href="/cv/{cv.id}/preview" class="flex-1 text-center border border-gray-300 text-gray-600 text-sm py-1.5 rounded-lg hover:bg-gray-50 transition">Preview</a>
						<button onclick={() => handleDuplicate(cv.id)} title="Duplicate" class="border border-gray-300 text-gray-500 text-sm px-2.5 rounded-lg hover:bg-gray-50 transition">⧉</button>
					</div>
				</div>
				{/each}
			</div>
		{/if}
	{/if}
</main>

<!-- Create modal -->
{#if showCreate}
<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50" role="dialog" aria-modal="true">
	<div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
		<h2 class="text-lg font-bold text-gray-800 mb-4">New CV</h2>
		<div class="space-y-4">
			<div>
				<label for="new-cv-name" class="block text-sm font-medium text-gray-700 mb-1">CV Name</label>
				<input id="new-cv-name" bind:value={newName} type="text" placeholder="e.g. Backend Engineer Role" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
			</div>
			<div>
				<label for="new-cv-template" class="block text-sm font-medium text-gray-700 mb-1">Template</label>
				<select id="new-cv-template" bind:value={newTemplate} class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
					<option value="blue-sidebar">Blue Sidebar</option>
					<option value="minimal-clean">Minimal Clean</option>
				</select>
			</div>
		</div>
		<div class="flex gap-2 mt-6">
			<button onclick={() => (showCreate = false)} class="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
			<button onclick={handleCreate} disabled={!newName.trim() || creating} class="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
				{creating ? 'Creating…' : 'Create'}
			</button>
		</div>
	</div>
</div>
{/if}
