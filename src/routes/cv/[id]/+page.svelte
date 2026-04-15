<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { getUser, isLoading } from '$lib/authStore.svelte';
	import { storage } from '$lib/firebase';
	import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	import { getCV, updateCV } from '$lib/cvStore';
	import type { CV, CVData, TemplateId, WorkExperience, Education, Language, Skill } from '$lib/types';
	import BlueSidebar from '$lib/templates/BlueSidebar.svelte';
	import MinimalClean from '$lib/templates/MinimalClean.svelte';

	let cv = $state<CV | null>(null);
	let loading = $state(true);
	let saving = $state(false);
	let saveMsg = $state('');
	let uploadingPhoto = $state(false);
	let activeTab = $state<'personal' | 'skills' | 'experience' | 'education' | 'languages'>('personal');
	let shareCopied = $state(false);
	let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

	// Crop modal state
	let showCropModal = $state(false);
	let cropImageSrc = $state('');
	let cropFile: File | null = null;
	let cropX = $state(50);
	let cropY = $state(50);
	let isDragging = $state(false);
	let dragStart = { x: 0, y: 0, cropX: 50, cropY: 50 };

	function onCropMouseDown(e: MouseEvent) {
		isDragging = true;
		dragStart = { x: e.clientX, y: e.clientY, cropX, cropY };
	}
	function onCropMouseMove(e: MouseEvent) {
		if (!isDragging) return;
		const dx = ((e.clientX - dragStart.x) / 200) * 100;
		const dy = ((e.clientY - dragStart.y) / 200) * 100;
		cropX = Math.max(0, Math.min(100, dragStart.cropX - dx));
		cropY = Math.max(0, Math.min(100, dragStart.cropY - dy));
	}
	function onCropMouseUp() { isDragging = false; }

	function copyShareLink() {
		const user = getUser();
		if (!user || !cv) return;
		const url = `${window.location.origin}/share/${user.uid}/${cv.id}`;
		navigator.clipboard.writeText(url);
		shareCopied = true;
		setTimeout(() => (shareCopied = false), 2000);
	}

	const id = $derived(page.params.id);

	$effect(() => {
		if (!isLoading()) loadCV();
	});

	// Auto-save: debounce 2s after any cv change
	$effect(() => {
		if (!cv || loading) return;
		// track cv deeply by stringifying — triggers on any nested change
		JSON.stringify(cv);
		if (autoSaveTimer) clearTimeout(autoSaveTimer);
		autoSaveTimer = setTimeout(() => {
			save(true);
		}, 2000);
	});

	async function loadCV() {
		const user = getUser();
		if (!user) {
			goto('/auth');
			return;
		}
		loading = true;
		cv = await getCV(user.uid, id);
		loading = false;
	}

	async function save(auto = false) {
		const user = getUser();
		if (!cv || !user) return;
		saving = true;
		await updateCV(user.uid, cv.id, { data: cv.data, templateId: cv.templateId, name: cv.name });
		saving = false;
		saveMsg = auto ? 'Auto-saved' : 'Saved!';
		setTimeout(() => (saveMsg = ''), 2000);
	}

	function handlePhotoUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file || !cv) return;
		cropFile = file;
		cropImageSrc = URL.createObjectURL(file);
		cropX = cv.data.photoCropX ?? 50;
		cropY = cv.data.photoCropY ?? 50;
		showCropModal = true;
	}

	async function confirmCrop() {
		const user = getUser();
		if (!cropFile || !cv || !user) return;
		showCropModal = false;
		uploadingPhoto = true;
		try {
			const storageRef = ref(storage, `photos/${user.uid}/${cv.id}`);
			await uploadBytes(storageRef, cropFile);
			const url = await getDownloadURL(storageRef);
			cv.data.photoUrl = url;
			cv.data.photoCropX = cropX;
			cv.data.photoCropY = cropY;
		} finally {
			uploadingPhoto = false;
			URL.revokeObjectURL(cropImageSrc);
		}
	}

	function addSkill() {
		if (!cv) return;
		cv.data.skills = [...cv.data.skills, { name: '', level: 50 }];
	}

	function removeSkill(i: number) {
		if (!cv) return;
		cv.data.skills = cv.data.skills.filter((_, idx) => idx !== i);
	}

	function addExperience() {
		if (!cv) return;
		const newExp: WorkExperience = {
			id: Date.now().toString(),
			startYear: '',
			endYear: '',
			title: '',
			company: '',
			location: '',
			description: [''],
			techStack: ''
		};
		cv.data.workExperience = [newExp, ...cv.data.workExperience];
	}

	function removeExperience(id: string) {
		if (!cv) return;
		cv.data.workExperience = cv.data.workExperience.filter((e) => e.id !== id);
	}

	function addDescPoint(expId: string) {
		if (!cv) return;
		cv.data.workExperience = cv.data.workExperience.map((e) =>
			e.id === expId ? { ...e, description: [...e.description, ''] } : e
		);
	}

	function removeDescPoint(expId: string, idx: number) {
		if (!cv) return;
		cv.data.workExperience = cv.data.workExperience.map((e) =>
			e.id === expId ? { ...e, description: e.description.filter((_, i) => i !== idx) } : e
		);
	}

	function addEducation() {
		if (!cv) return;
		cv.data.education = [
			...cv.data.education,
			{ id: Date.now().toString(), startYear: '', endYear: '', degree: '', institution: '' }
		];
	}

	function removeEducation(id: string) {
		if (!cv) return;
		cv.data.education = cv.data.education.filter((e) => e.id !== id);
	}

	function addLanguage() {
		if (!cv) return;
		cv.data.languages = [
			...cv.data.languages,
			{ id: Date.now().toString(), name: '', writeLevel: 'Good', speakLevel: 'Good' }
		];
	}

	function removeLanguage(id: string) {
		if (!cv) return;
		cv.data.languages = cv.data.languages.filter((l) => l.id !== id);
	}

	const levels = ['Low', 'Fair', 'Good', 'Very Good', 'Excellent'];
</script>

{#if loading}
	<div class="text-center py-20 text-gray-400">Loading…</div>
{:else if !cv}
	<div class="text-center py-20 text-gray-400">CV not found. <a href="/" class="text-blue-600">Go back</a></div>
{:else}
<div class="flex h-[calc(100vh-52px)] overflow-hidden">
	<!-- Editor panel -->
	<div class="w-[420px] shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden print:hidden">
		<!-- Header -->
		<div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<a href="/" class="text-gray-400 hover:text-gray-600 text-lg leading-none">←</a>
				<input bind:value={cv.name} class="font-semibold text-gray-800 text-sm border-none outline-none bg-transparent" />
			</div>
			<div class="flex items-center gap-2">
				{#if saveMsg}<span class="text-xs text-green-600">{saveMsg}</span>{/if}
				<button onclick={() => save(false)} disabled={saving} class="bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50">
					{saving ? 'Saving…' : 'Save'}
				</button>
			</div>
		</div>

		<!-- Template selector -->
		<div class="px-4 py-2 border-b border-gray-100 flex gap-2 items-center">
			<span class="text-xs text-gray-500 font-medium">Template:</span>
			<select bind:value={cv.templateId} class="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
				<option value="blue-sidebar">Blue Sidebar</option>
				<option value="minimal-clean">Minimal Clean</option>
			</select>
			<div class="ml-auto flex items-center gap-3">
			<button onclick={copyShareLink} class="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1" title="Copy share link">
				🔗 {shareCopied ? 'Copied!' : 'Share'}
			</button>
			<a href="/cv/{cv.id}/preview" target="_blank" class="text-xs text-blue-600 hover:underline">Open preview ↗</a>
		</div>
		</div>

		<!-- Tabs -->
		<div class="flex border-b border-gray-200 text-xs font-medium overflow-x-auto">
			{#each (['personal','skills','experience','education','languages'] as const) as tab}
			<button
				onclick={() => (activeTab = tab)}
				class="px-3 py-2 shrink-0 capitalize {activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}"
			>{tab}</button>
			{/each}
		</div>

		<!-- Form content -->
		<div class="flex-1 overflow-y-auto p-4 space-y-3">

			<!-- Personal -->
			{#if activeTab === 'personal'}
			<div class="space-y-3">
				<div>
					<span class="label">Photo</span>
					<div class="flex items-center gap-3">
						{#if cv.data.photoUrl}
							<img src={cv.data.photoUrl} alt={cv.data.name} class="w-12 h-12 rounded-full object-cover" />
						{/if}
						<label class="cursor-pointer text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded border border-gray-300">
							{uploadingPhoto ? 'Uploading…' : 'Upload photo'}
							<input type="file" accept="image/*" class="hidden" onchange={handlePhotoUpload} />
						</label>
					</div>
				</div>
				<div><label class="label" for="p-name">Full Name</label><input id="p-name" bind:value={cv.data.name} class="input" /></div>
				<div><label class="label" for="p-title">Title / Role</label><input id="p-title" bind:value={cv.data.title} class="input" /></div>
				<div><label class="label" for="p-phone">Phone</label><input id="p-phone" bind:value={cv.data.phone} class="input" /></div>
				<div><label class="label" for="p-email">Email</label><input id="p-email" bind:value={cv.data.email} class="input" type="email" /></div>
				<div><label class="label" for="p-skype">Skype</label><input id="p-skype" bind:value={cv.data.skype} class="input" /></div>
				<div><label class="label" for="p-address">Address</label><input id="p-address" bind:value={cv.data.address} class="input" /></div>
				<div><label class="label" for="p-linkedin">LinkedIn URL</label><input id="p-linkedin" bind:value={cv.data.linkedin} class="input" /></div>
				<div>
					<label class="label" for="p-about">About Me</label>
					<textarea id="p-about" bind:value={cv.data.about} class="input resize-none" rows="6"></textarea>
				</div>
			</div>

			<!-- Skills -->
			{:else if activeTab === 'skills'}
			<button onclick={addSkill} class="w-full text-xs border border-dashed border-blue-400 text-blue-600 py-2 rounded hover:bg-blue-50">+ Add Skill</button>
			{#each cv.data.skills as skill, i}
			<div class="bg-gray-50 rounded-lg p-3 space-y-2">
				<div class="flex gap-2">
					<input bind:value={skill.name} placeholder="Skill name" class="input flex-1 text-xs" />
					<button onclick={() => removeSkill(i)} class="text-red-400 hover:text-red-600 text-sm px-1">✕</button>
				</div>
				<div class="flex items-center gap-2">
					<input type="range" min="0" max="100" bind:value={skill.level} class="flex-1" />
					<span class="text-xs text-gray-500 w-8">{skill.level}%</span>
				</div>
			</div>
			{/each}

			<!-- Work Experience -->
			{:else if activeTab === 'experience'}
			<button onclick={addExperience} class="w-full text-xs border border-dashed border-blue-400 text-blue-600 py-2 rounded hover:bg-blue-50">+ Add Experience</button>
			{#each cv.data.workExperience as exp}
			<div class="bg-gray-50 rounded-lg p-3 space-y-2">
				<div class="flex gap-2">
					<input bind:value={exp.startYear} placeholder="Start" class="input w-20 text-xs" />
					<input bind:value={exp.endYear} placeholder="End" class="input w-20 text-xs" />
					<button onclick={() => removeExperience(exp.id)} class="ml-auto text-red-400 hover:text-red-600 text-sm">✕</button>
				</div>
				<input bind:value={exp.title} placeholder="Job Title" class="input text-xs" />
				<input bind:value={exp.company} placeholder="Company" class="input text-xs" />
				<input bind:value={exp.location} placeholder="Location" class="input text-xs" />
				<div>
					<div class="text-xs font-medium text-gray-600 mb-1">Description points</div>
					{#each exp.description as _, idx}
					<div class="flex gap-1 mb-1">
						<input bind:value={exp.description[idx]} placeholder="Point {idx + 1}" class="input text-xs flex-1" />
						<button onclick={() => removeDescPoint(exp.id, idx)} class="text-red-400 text-xs px-1">✕</button>
					</div>
					{/each}
					<button onclick={() => addDescPoint(exp.id)} class="text-xs text-blue-500 hover:underline">+ point</button>
				</div>
				<div>
					<span class="text-xs font-medium text-gray-600">Tech Stack</span>
					<textarea bind:value={exp.techStack} class="input text-xs resize-none mt-1" rows="2" aria-label="Tech stack"></textarea>
				</div>
			</div>
			{/each}

			<!-- Education -->
			{:else if activeTab === 'education'}
			<button onclick={addEducation} class="w-full text-xs border border-dashed border-blue-400 text-blue-600 py-2 rounded hover:bg-blue-50">+ Add Education</button>
			{#each cv.data.education as edu}
			<div class="bg-gray-50 rounded-lg p-3 space-y-2">
				<div class="flex gap-2">
					<input bind:value={edu.startYear} placeholder="Start" class="input w-20 text-xs" />
					<input bind:value={edu.endYear} placeholder="End" class="input w-20 text-xs" />
					<button onclick={() => removeEducation(edu.id)} class="ml-auto text-red-400 hover:text-red-600 text-sm">✕</button>
				</div>
				<input bind:value={edu.degree} placeholder="Degree / Program" class="input text-xs" />
				<input bind:value={edu.institution} placeholder="Institution" class="input text-xs" />
			</div>
			{/each}

			<!-- Languages -->
			{:else if activeTab === 'languages'}
			<button onclick={addLanguage} class="w-full text-xs border border-dashed border-blue-400 text-blue-600 py-2 rounded hover:bg-blue-50">+ Add Language</button>
			{#each cv.data.languages as lang}
			<div class="bg-gray-50 rounded-lg p-3 space-y-2">
				<div class="flex gap-2">
					<input bind:value={lang.name} placeholder="Language" class="input flex-1 text-xs" />
					<button onclick={() => removeLanguage(lang.id)} class="text-red-400 hover:text-red-600 text-sm">✕</button>
				</div>
				<div class="flex gap-2">
					<div class="flex-1">
						<span class="text-xs text-gray-500">Write</span>
						<select bind:value={lang.writeLevel} class="input text-xs mt-0.5" aria-label="Write level">
							{#each levels as l}<option>{l}</option>{/each}
						</select>
					</div>
					<div class="flex-1">
						<span class="text-xs text-gray-500">Spoken</span>
						<select bind:value={lang.speakLevel} class="input text-xs mt-0.5" aria-label="Spoken level">
							{#each levels as l}<option>{l}</option>{/each}
						</select>
					</div>
				</div>
			</div>
			{/each}
			{/if}
		</div>
	</div>

	<!-- Live Preview -->
	<div class="flex-1 overflow-auto bg-gray-200 p-8 flex justify-center items-start">
		<div class="shadow-2xl">
			{#if cv.templateId === 'blue-sidebar'}
				<BlueSidebar data={cv.data} />
			{:else}
				<MinimalClean data={cv.data} />
			{/if}
		</div>
	</div>
</div>
{/if}

<!-- Crop modal -->
{#if showCropModal}
<div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
	<div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
		<h2 class="text-base font-bold text-gray-800 mb-1">Position Photo</h2>
		<p class="text-xs text-gray-400 mb-4">Drag to reposition within the circle</p>
		<div
			class="w-48 h-48 rounded-full overflow-hidden mx-auto border-4 border-blue-500 cursor-grab active:cursor-grabbing select-none"
			role="presentation"
			onmousedown={onCropMouseDown}
			onmousemove={onCropMouseMove}
			onmouseup={onCropMouseUp}
			onmouseleave={onCropMouseUp}
		>
			<img
				src={cropImageSrc}
				alt="crop preview"
				class="w-full h-full object-cover pointer-events-none"
				style="object-position:{cropX}% {cropY}%;"
				draggable="false"
			/>
		</div>
		<div class="flex gap-2 mt-6">
			<button onclick={() => { showCropModal = false; URL.revokeObjectURL(cropImageSrc); }} class="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm">Cancel</button>
			<button onclick={confirmCrop} class="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">Use this</button>
		</div>
	</div>
</div>
{/if}

<style>
	:global(.label) {
		display: block;
		font-size: 0.75rem;
		font-weight: 500;
		color: #374151;
		margin-bottom: 0.25rem;
	}
	:global(.input) {
		width: 100%;
		border: 1px solid #d1d5db;
		border-radius: 0.25rem;
		padding: 0.375rem 0.5rem;
		font-size: 0.875rem;
	}
	:global(.input:focus) {
		outline: none;
		box-shadow: 0 0 0 2px #3b82f6;
	}
</style>
