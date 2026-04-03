<script lang="ts">
	import type { CVData } from '$lib/types';

	let { data }: { data: CVData } = $props();
</script>

<div class="cv-page font-sans text-[11px] leading-tight text-gray-800 bg-white px-12 py-10" style="width:210mm; min-height:297mm; font-family:'Georgia',serif;">
	<!-- Header -->
	<div class="flex items-start justify-between border-b-2 border-gray-900 pb-4 mb-6">
		<div class="flex items-center gap-5">
			{#if data.photoUrl}
				<img src={data.photoUrl} alt={data.name} class="w-20 h-20 rounded-full object-cover border-2 border-gray-300" />
			{/if}
			<div>
				<h1 class="text-[28px] font-bold text-gray-900">{data.name}</h1>
				<p class="text-[12px] text-gray-500 uppercase tracking-widest font-light">{data.title}</p>
			</div>
		</div>
		<div class="text-right text-[9.5px] text-gray-600 space-y-1 pt-1">
			{#if data.email}<div>{data.email}</div>{/if}
			{#if data.phone}<div>{data.phone}</div>{/if}
			{#if data.address}<div>{data.address}</div>{/if}
			{#if data.linkedin}<div class="text-[8.5px]">{data.linkedin}</div>{/if}
		</div>
	</div>

	<!-- About -->
	{#if data.about}
	<section class="mb-5">
		<h2 class="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2">Profile</h2>
		<p class="text-[10px] text-gray-700 leading-relaxed">{data.about.split('\n')[0]}</p>
	</section>
	{/if}

	<!-- Two-column layout -->
	<div class="flex gap-8">
		<!-- Left: Experience + Education -->
		<div class="flex-[2]">
			{#if data.workExperience.length > 0}
			<section class="mb-5">
				<h2 class="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-3">Experience</h2>
				<div class="space-y-4">
					{#each data.workExperience as exp}
					<div>
						<div class="flex justify-between items-start">
							<div>
								<div class="font-bold text-[10.5px]">{exp.title}</div>
								<div class="text-[9.5px] text-gray-600 italic">{exp.company}{exp.location ? ', ' + exp.location : ''}</div>
							</div>
							<span class="text-[9px] text-gray-400 shrink-0 ml-2">{exp.startYear} – {exp.endYear}</span>
						</div>
						{#if exp.description.length > 0}
						<ul class="list-disc list-inside mt-1 space-y-0.5 pl-2">
							{#each exp.description.slice(0, 3) as point}
							<li class="text-[9px] text-gray-700">{point}</li>
							{/each}
						</ul>
						{/if}
						{#if exp.techStack}
						<p class="text-[8.5px] text-gray-500 mt-1 italic">{exp.techStack}</p>
						{/if}
					</div>
					{/each}
				</div>
			</section>
			{/if}

			{#if data.education.length > 0}
			<section>
				<h2 class="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-3">Education</h2>
				<div class="space-y-2">
					{#each data.education as edu}
					<div class="flex justify-between">
						<div>
							<div class="font-bold text-[10px]">{edu.institution}</div>
							<div class="text-[9.5px] text-gray-600">{edu.degree}</div>
						</div>
						<span class="text-[9px] text-gray-400 shrink-0">{edu.startYear} – {edu.endYear}</span>
					</div>
					{/each}
				</div>
			</section>
			{/if}
		</div>

		<!-- Right: Skills + Languages -->
		<div class="flex-[1]">
			{#if data.skills.length > 0}
			<section class="mb-5">
				<h2 class="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-3">Skills</h2>
				<ul class="space-y-2">
					{#each data.skills as skill}
					<li>
						<div class="text-[9px] font-semibold text-gray-700">{skill.name}</div>
						<div class="h-1 bg-gray-200 rounded mt-0.5">
							<div class="h-1 bg-gray-700 rounded" style="width:{skill.level}%"></div>
						</div>
					</li>
					{/each}
				</ul>
			</section>
			{/if}

			{#if data.languages.length > 0}
			<section>
				<h2 class="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-3">Languages</h2>
				<ul class="space-y-1.5">
					{#each data.languages as lang}
					<li>
						<div class="font-semibold text-[10px]">{lang.name}</div>
						<div class="text-[8.5px] text-gray-500">{lang.speakLevel}</div>
					</li>
					{/each}
				</ul>
			</section>
			{/if}
		</div>
	</div>
</div>
