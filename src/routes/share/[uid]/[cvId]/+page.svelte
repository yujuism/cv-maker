<script lang="ts">
	import { page } from '$app/state';
	import { getCV } from '$lib/cvStore';
	import type { CV } from '$lib/types';
	import BlueSidebar from '$lib/templates/BlueSidebar.svelte';
	import MinimalClean from '$lib/templates/MinimalClean.svelte';
	import html2canvas from 'html2canvas';
	import { jsPDF } from 'jspdf';

	let cv = $state<CV | null>(null);
	let loading = $state(true);
	let notFound = $state(false);
	let exporting = $state(false);

	async function exportPDF() {
		const el = document.getElementById('cv-share-target');
		if (!el || !cv) return;
		exporting = true;
		try {
			const canvas = await html2canvas(el, { scale: 2, useCORS: true });
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
			const pageW = pdf.internal.pageSize.getWidth();
			const pageH = pdf.internal.pageSize.getHeight();
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

	const uid = $derived(page.params.uid);
	const cvId = $derived(page.params.cvId);

	$effect(() => {
		getCV(uid, cvId).then((result) => {
			cv = result;
			notFound = !result;
			loading = false;
		});
	});
</script>

<svelte:head>
	<title>{cv ? `${cv.data.name || 'CV'} — CV Maker` : 'CV'}</title>
	<style>
		@media print {
			@page { margin: 0; }
			body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
		}
	</style>
</svelte:head>

{#if loading}
	<div class="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>
{:else if notFound}
	<div class="min-h-screen flex items-center justify-center text-gray-400">CV not found or not shared publicly.</div>
{:else if cv}
	<div class="min-h-screen bg-gray-100 flex flex-col items-center py-8 print:bg-white print:p-0 print:block">
		<div class="print:hidden mb-4 flex items-center gap-4">
			<span class="text-sm text-gray-500">Shared CV — <strong>{cv.data.name || 'Untitled'}</strong></span>
			<button onclick={exportPDF} disabled={exporting} class="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50">
				{exporting ? 'Exporting…' : 'Download PDF'}
			</button>
		</div>
		<div id="cv-share-target" class="shadow-2xl">
			{#if cv.templateId === 'blue-sidebar'}
				<BlueSidebar data={cv.data} />
			{:else}
				<MinimalClean data={cv.data} />
			{/if}
		</div>
	</div>
{/if}
