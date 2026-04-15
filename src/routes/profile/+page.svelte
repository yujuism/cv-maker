<script lang="ts">
	import { goto } from '$app/navigation';
	import { getUser, isLoading } from '$lib/authStore.svelte';
	import { createUserProfile, getUserProfile, updateUserProfile, deleteUserProfile, deleteAccount } from '$lib/userProfileStore';
	import { signOut } from '$lib/authStore.svelte';
	import { storage } from '$lib/firebase';
	import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	import type { UserProfile } from '$lib/types';

	let profile = $state<UserProfile | null>(null);
	let loading = $state(true);
	let saving = $state(false);
	let saveMsg = $state('');
	let uploadingPhoto = $state(false);
	let showDeleteConfirm = $state(false);
	let showDeleteAccountConfirm = $state(false);

	// Photo crop state
	let showCropModal = $state(false);
	let cropImageSrc = $state('');
	let cropFile: File | null = null;
	let cropX = $state(50);
	let cropY = $state(50);
	let isDragging = $state(false);
	let dragStart = { x: 0, y: 0, cropX: 50, cropY: 50 };

	$effect(() => {
		if (!isLoading()) {
			const user = getUser();
			if (!user) { goto('/auth'); return; }
			loadProfile(user.uid);
		}
	});

	async function loadProfile(uid: string) {
		loading = true;
		let p = await getUserProfile(uid);
		if (!p) {
			// auto-create profile on first visit
			await createUserProfile(uid, {
				displayName: getUser()?.displayName ?? '',
				defaultEmail: getUser()?.email ?? '',
				photoUrl: getUser()?.photoURL ?? ''
			});
			p = await getUserProfile(uid);
		}
		profile = p;
		if (p) { cropX = 50; cropY = 50; }
		loading = false;
	}

	async function save() {
		const user = getUser();
		if (!profile || !user) return;
		saving = true;
		await updateUserProfile(user.uid, profile);
		saving = false;
		saveMsg = 'Saved!';
		setTimeout(() => (saveMsg = ''), 2000);
	}

	function openCropModal(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		cropFile = file;
		cropImageSrc = URL.createObjectURL(file);
		cropX = 50;
		cropY = 50;
		showCropModal = true;
	}

	function onMouseDown(e: MouseEvent) {
		isDragging = true;
		dragStart = { x: e.clientX, y: e.clientY, cropX, cropY };
	}

	function onMouseMove(e: MouseEvent) {
		if (!isDragging) return;
		const dx = ((e.clientX - dragStart.x) / 200) * 100;
		const dy = ((e.clientY - dragStart.y) / 200) * 100;
		cropX = Math.max(0, Math.min(100, dragStart.cropX - dx));
		cropY = Math.max(0, Math.min(100, dragStart.cropY - dy));
	}

	function onMouseUp() { isDragging = false; }

	async function confirmCrop() {
		const user = getUser();
		if (!cropFile || !profile || !user) return;
		showCropModal = false;
		uploadingPhoto = true;
		try {
			const storageRef = ref(storage, `profile-photos/${user.uid}`);
			await uploadBytes(storageRef, cropFile);
			const url = await getDownloadURL(storageRef);
			profile.photoUrl = url;
			await updateUserProfile(user.uid, { photoUrl: url });
		} finally {
			uploadingPhoto = false;
			URL.revokeObjectURL(cropImageSrc);
		}
	}

	async function handleDelete() {
		const user = getUser();
		if (!user) return;
		await deleteUserProfile(user.uid);
		profile = null;
		showDeleteConfirm = false;
		saveMsg = 'Profile deleted.';
		setTimeout(() => goto('/'), 1500);
	}

	async function handleDeleteAccount() {
		const user = getUser();
		if (!user) return;
		await deleteAccount(user.uid);
		await signOut();
		goto('/auth');
	}
</script>

<svelte:head><title>My Profile — CV Maker</title></svelte:head>

<main class="max-w-xl mx-auto px-6 py-10">
	<div class="flex items-center gap-3 mb-8">
		<a href="/" class="text-gray-400 hover:text-gray-600">←</a>
		<h1 class="text-2xl font-bold text-gray-800">My Profile</h1>
	</div>

	{#if loading}
		<div class="text-center py-20 text-gray-400">Loading…</div>
	{:else if profile}
		<div class="bg-white rounded-xl border border-gray-200 p-6 space-y-5">

			<!-- Photo -->
			<div>
				<span class="block text-sm font-medium text-gray-700 mb-2">Profile Photo</span>
				<div class="flex items-center gap-4">
					{#if profile.photoUrl}
						<img
							src={profile.photoUrl}
							alt="profile"
							class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
						/>
					{:else}
						<div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold">
							{profile.displayName?.charAt(0) ?? '?'}
						</div>
					{/if}
					<label class="cursor-pointer text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300">
						{uploadingPhoto ? 'Uploading…' : 'Change photo'}
						<input type="file" accept="image/*" class="hidden" onchange={openCropModal} />
					</label>
				</div>
			</div>

			<div>
				<label for="prof-name" class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
				<input id="prof-name" bind:value={profile.displayName} class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
			</div>

			<div>
				<label for="prof-bio" class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
				<textarea id="prof-bio" bind:value={profile.bio} rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
			</div>

			<div>
				<label for="prof-email" class="block text-sm font-medium text-gray-700 mb-1">Default Email</label>
				<input id="prof-email" bind:value={profile.defaultEmail} type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
			</div>

			<div>
				<label for="prof-phone" class="block text-sm font-medium text-gray-700 mb-1">Default Phone</label>
				<input id="prof-phone" bind:value={profile.defaultPhone} class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
			</div>

			<div>
				<label for="prof-address" class="block text-sm font-medium text-gray-700 mb-1">Default Address</label>
				<input id="prof-address" bind:value={profile.defaultAddress} class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
			</div>

			<div class="flex items-center justify-between pt-2">
				<div class="flex gap-3">
					<button onclick={() => (showDeleteConfirm = true)} class="text-sm text-red-400 hover:text-red-600">
						Delete profile
					</button>
					<button onclick={() => (showDeleteAccountConfirm = true)} class="text-sm text-red-600 hover:text-red-800 font-medium">
						Delete account
					</button>
				</div>
				<div class="flex items-center gap-3">
					{#if saveMsg}<span class="text-xs text-green-600">{saveMsg}</span>{/if}
					<button onclick={save} disabled={saving} class="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
						{saving ? 'Saving…' : 'Save'}
					</button>
				</div>
			</div>
		</div>
	{/if}
</main>

<!-- Delete confirm modal -->
{#if showDeleteConfirm}
<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
	<div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
		<h2 class="text-lg font-bold text-gray-800 mb-2">Delete Profile?</h2>
		<p class="text-sm text-gray-500 mb-6">Your profile data will be deleted. Your CVs will not be affected.</p>
		<div class="flex gap-2">
			<button onclick={() => (showDeleteConfirm = false)} class="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm">Cancel</button>
			<button onclick={handleDelete} class="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700">Delete</button>
		</div>
	</div>
</div>
{/if}

<!-- Delete account confirm modal -->
{#if showDeleteAccountConfirm}
<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
	<div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
		<h2 class="text-lg font-bold text-gray-800 mb-2">Delete Account?</h2>
		<p class="text-sm text-gray-500 mb-2">This will permanently delete:</p>
		<ul class="text-sm text-red-600 mb-6 list-disc list-inside space-y-1">
			<li>Your profile</li>
			<li>All your CVs</li>
			<li>All your data</li>
		</ul>
		<p class="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
		<div class="flex gap-2">
			<button onclick={() => (showDeleteAccountConfirm = false)} class="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm">Cancel</button>
			<button onclick={handleDeleteAccount} class="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 font-medium">Yes, delete everything</button>
		</div>
	</div>
</div>
{/if}

<!-- Crop modal -->
{#if showCropModal}
<div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
	<div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
		<h2 class="text-lg font-bold text-gray-800 mb-2">Position Photo</h2>
		<p class="text-xs text-gray-400 mb-4">Drag to reposition</p>

		<!-- Circle preview with draggable image -->
		<div
			class="w-48 h-48 rounded-full overflow-hidden mx-auto border-4 border-blue-500 cursor-grab active:cursor-grabbing select-none"
			role="presentation"
			onmousedown={onMouseDown}
			onmousemove={onMouseMove}
			onmouseup={onMouseUp}
			onmouseleave={onMouseUp}
		>
			<img
				src={cropImageSrc}
				alt="crop preview"
				class="w-full h-full object-cover pointer-events-none"
				style="object-position: {cropX}% {cropY}%;"
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
