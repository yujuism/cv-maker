<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { getCV } from '$lib/cvStore';
	import { getUser, isLoading } from '$lib/authStore.svelte';
	import type { CV } from '$lib/types';
	import BlueSidebar from '$lib/templates/BlueSidebar.svelte';
	import MinimalClean from '$lib/templates/MinimalClean.svelte';

	import html2canvas from 'html2canvas';
	import { jsPDF } from 'jspdf';

	let cv = $state<CV | null>(null);
	let loading = $state(true);
	let exporting = $state(false);

	const id = $derived(page.params.id);

	$effect(() => {
		if (!isLoading()) loadCV();
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

	async function exportPDF() {
		const el = document.getElementById('cv-export-target');
		if (!el || !cv) return;
		exporting = true;
		try {
			const canvas = await html2canvas(el, { scale: 2, useCORS: true });
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
			const pageW = pdf.internal.pageSize.getWidth();
			const pageH = pdf.internal.pageSize.getHeight();
			// scale image width to page width, split into multiple pages
			const imgW = pageW;
			const imgH = (canvas.height * pageW) / canvas.width;
			let yPos = 0;
			let remaining = imgH;
			while (remaining > 0) {
				pdf.addImage(imgData, 'PNG', 0, -yPos, imgW, imgH);
				remaining -= pageH;
				if (remaining > 0) {
					pdf.addPage();
					yPos += pageH;
				}
			}
			pdf.save(`${cv.data.name || cv.name || 'cv'}.pdf`);
		} finally {
			exporting = false;
		}
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
			<button onclick={() => window.print()} class="border border-gray-300 text-gray-600 text-sm px-4 py-1.5 rounded hover:bg-gray-50">
				Print
			</button>
			<button onclick={exportPDF} disabled={exporting} class="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50">
				{exporting ? 'Exporting…' : 'Download PDF'}
			</button>
		</div>
	</div>

	<div class="bg-gray-200 min-h-screen p-8 flex justify-center print:bg-white print:p-0">
		<div id="cv-export-target" class="shadow-2xl print:shadow-none">
			{#if cv.templateId === 'blue-sidebar'}
				<BlueSidebar data={cv.data} />
			{:else}
				<MinimalClean data={cv.data} />
			{/if}
		</div>
	</div>
{/if}
