<script lang="ts">
	import type { CVData } from '$lib/types';

	let { data }: { data: CVData } = $props();
</script>

<div class="cv-page font-sans text-[11px] leading-tight text-gray-800 bg-white flex" style="width:210mm; min-height:297mm; font-family:'Segoe UI',sans-serif;">
	<!-- Left sidebar -->
	<div class="w-[38%] bg-[#f0f2f5] flex flex-col items-center pt-8 pb-6 px-5">
		<!-- Photo -->
		{#if data.photoUrl}
			<img src={data.photoUrl} alt={data.name} class="w-24 h-24 rounded-full object-cover border-4 border-white shadow mb-4" />
		{:else}
			<div class="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-3xl font-bold mb-4 border-4 border-white shadow">
				{data.name.charAt(0)}
			</div>
		{/if}

		<!-- Contact -->
		<section class="w-full mb-5">
			<div class="flex items-center gap-2 mb-2">
				<div class="flex-1 h-[2px] bg-[#2563eb]"></div>
				<h2 class="text-[10px] font-bold tracking-widest text-gray-700 uppercase px-1">Contact</h2>
				<div class="flex-1 h-[2px] bg-[#2563eb]"></div>
			</div>
			<ul class="space-y-1.5 mt-2">
				{#if data.phone}
				<li class="flex items-start gap-2">
					<span class="text-[#2563eb] mt-[1px]">📞</span>
					<span class="break-all">{data.phone}</span>
				</li>
				{/if}
				{#if data.email}
				<li class="flex items-start gap-2">
					<span class="text-[#2563eb] mt-[1px]">✉</span>
					<span class="break-all">{data.email}</span>
				</li>
				{/if}
				{#if data.skype}
				<li class="flex items-start gap-2">
					<span class="text-[#2563eb] mt-[1px]">💬</span>
					<span>{data.skype}</span>
				</li>
				{/if}
				{#if data.address}
				<li class="flex items-start gap-2">
					<span class="text-[#2563eb] mt-[1px]">📍</span>
					<span>{data.address}</span>
				</li>
				{/if}
				{#if data.linkedin}
				<li class="flex items-start gap-2">
					<span class="text-[#2563eb] mt-[1px]">🔗</span>
					<span class="break-all text-[9px]">{data.linkedin}</span>
				</li>
				{/if}
			</ul>
		</section>

		<!-- Skills -->
		{#if data.skills.length > 0}
		<section class="w-full mb-5">
			<div class="flex items-center gap-2 mb-2">
				<div class="flex-1 h-[2px] bg-[#2563eb]"></div>
				<h2 class="text-[10px] font-bold tracking-widest text-gray-700 uppercase px-1">Skills</h2>
				<div class="flex-1 h-[2px] bg-[#2563eb]"></div>
			</div>
			<ul class="space-y-2 mt-2">
				{#each data.skills as skill}
				<li>
					<span class="font-semibold text-[9.5px] uppercase tracking-wide">{skill.name}</span>
					<div class="h-1.5 bg-gray-300 rounded-full mt-0.5">
						<div class="h-1.5 bg-[#2563eb] rounded-full" style="width:{skill.level}%"></div>
					</div>
				</li>
				{/each}
			</ul>
		</section>
		{/if}

		<!-- Languages -->
		{#if data.languages.length > 0}
		<section class="w-full">
			<div class="flex items-center gap-2 mb-2">
				<div class="flex-1 h-[2px] bg-[#2563eb]"></div>
				<h2 class="text-[10px] font-bold tracking-widest text-gray-700 uppercase px-1">Languages</h2>
				<div class="flex-1 h-[2px] bg-[#2563eb]"></div>
			</div>
			<ul class="space-y-1.5 mt-2">
				{#each data.languages as lang}
				<li class="flex justify-between">
					<span class="font-semibold">{lang.name}</span>
					<span class="text-gray-500 text-[9px]">Write: {lang.writeLevel} | Spoken: {lang.speakLevel}</span>
				</li>
				{/each}
			</ul>
		</section>
		{/if}
	</div>

	<!-- Right main content -->
	<div class="flex-1 px-6 py-8">
		<!-- Name & Title -->
		<div class="mb-5">
			<h1 class="text-[26px] font-bold text-gray-900 leading-none">{data.name}</h1>
			<p class="text-[11px] font-semibold tracking-widest text-gray-500 uppercase mt-1">{data.title}</p>
		</div>

		<!-- About Me -->
		{#if data.about}
		<section class="mb-5">
			<div class="bg-[#2563eb] text-white font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 mb-2">About Me</div>
			<p class="text-[10px] text-gray-700 leading-relaxed whitespace-pre-line">{data.about}</p>
		</section>
		{/if}

		<!-- Work Experience -->
		{#if data.workExperience.length > 0}
		<section class="mb-5">
			<div class="bg-[#2563eb] text-white font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 mb-2">Work Experience</div>
			<div class="space-y-4">
				{#each data.workExperience as exp}
				<div>
					<div class="text-[9px] text-gray-500">{exp.startYear} - {exp.endYear}</div>
					<div class="font-bold text-[10.5px] uppercase">{exp.title}</div>
					<div class="text-[9.5px] text-gray-600 mb-1">{exp.company}{exp.location ? ', ' + exp.location : ''}</div>
					{#if exp.description.length > 0}
					<div class="font-semibold text-[9.5px] mb-0.5">Description:</div>
					<ol class="list-decimal list-inside space-y-0.5 pl-1">
						{#each exp.description as point}
						<li class="text-[9px] text-gray-700">{point}</li>
						{/each}
					</ol>
					{/if}
					{#if exp.techStack}
					<div class="mt-1">
						<span class="font-semibold text-[9.5px]">Tech Stack: </span>
						<span class="text-[9px] text-gray-700">{exp.techStack}</span>
					</div>
					{/if}
				</div>
				{/each}
			</div>
		</section>
		{/if}

		<!-- Education -->
		{#if data.education.length > 0}
		<section>
			<div class="bg-[#2563eb] text-white font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 mb-2">Education</div>
			<div class="space-y-2">
				{#each data.education as edu}
				<div>
					<div class="text-[9px] text-gray-500">{edu.startYear} - {edu.endYear}</div>
					<div class="font-semibold text-[10px]">{edu.degree || '-'}</div>
					<div class="text-[9.5px] text-gray-600">{edu.institution}</div>
				</div>
				{/each}
			</div>
		</section>
		{/if}
	</div>
</div>
