<script lang="ts">
	import type { CVData } from '$lib/types';

	let { data }: { data: CVData } = $props();
</script>

<div style="width:210mm; font-family:'Segoe UI',Arial,sans-serif; font-size:9.5px; line-height:1.3; color:#1f2937; background:#fff; display:flex;">
	<!-- Left sidebar -->
	<div style="width:36%; background:#f0f2f5; display:flex; flex-direction:column; align-items:center; padding:20px 14px 16px; align-self:stretch;">
		<!-- Photo -->
		{#if data.photoUrl}
			<img src={data.photoUrl} alt={data.name} style="width:96px; height:96px; border-radius:50%; object-fit:cover; border:4px solid white; margin-bottom:16px; object-position:{data.photoCropX ?? 50}% {data.photoCropY ?? 50}%;" />
		{:else if data.name}
			<div style="width:96px; height:96px; border-radius:50%; background:#9ca3af; display:flex; align-items:center; justify-content:center; color:white; font-size:30px; font-weight:700; margin-bottom:16px; border:4px solid white;">
				{data.name.charAt(0)}
			</div>
		{/if}

		<!-- Contact -->
		<section style="width:100%; margin-bottom:20px;">
			<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
				<div style="flex:1; height:2px; background:#2563eb;"></div>
				<h2 style="font-size:10px; font-weight:700; letter-spacing:0.1em; color:#374151; text-transform:uppercase; padding:0 4px;">Contact</h2>
				<div style="flex:1; height:2px; background:#2563eb;"></div>
			</div>
			<ul style="list-style:none; padding:0; margin:8px 0 0;">
				{#if data.phone}
				<li style="display:flex; gap:8px; margin-bottom:6px;">
					<span style="color:#2563eb;">📞</span>
					<span style="word-break:break-all;">{data.phone}</span>
				</li>
				{/if}
				{#if data.email}
				<li style="display:flex; gap:8px; margin-bottom:6px;">
					<span style="color:#2563eb;">✉</span>
					<span style="word-break:break-all;">{data.email}</span>
				</li>
				{/if}
				{#if data.skype}
				<li style="display:flex; gap:8px; margin-bottom:6px;">
					<span style="color:#2563eb;">💬</span>
					<span>{data.skype}</span>
				</li>
				{/if}
				{#if data.address}
				<li style="display:flex; gap:8px; margin-bottom:6px;">
					<span style="color:#2563eb;">📍</span>
					<span>{data.address}</span>
				</li>
				{/if}
				{#if data.linkedin}
				<li style="display:flex; gap:8px; margin-bottom:6px;">
					<span style="color:#2563eb;">🔗</span>
					<span style="word-break:break-all; font-size:9px;">{data.linkedin}</span>
				</li>
				{/if}
			</ul>
		</section>

		<!-- Skills -->
		{#if data.skills.length > 0}
		<section style="width:100%; margin-bottom:20px;">
			<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
				<div style="flex:1; height:2px; background:#2563eb;"></div>
				<h2 style="font-size:10px; font-weight:700; letter-spacing:0.1em; color:#374151; text-transform:uppercase; padding:0 4px;">Skills</h2>
				<div style="flex:1; height:2px; background:#2563eb;"></div>
			</div>
			<ul style="list-style:none; padding:0; margin:8px 0 0;">
				{#each data.skills as skill}
				<li style="margin-bottom:8px;">
					<span style="font-size:9.5px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">{skill.name}</span>
					<div style="height:6px; background:#d1d5db; border-radius:999px; margin-top:2px;">
						<div style="height:6px; background:#2563eb; border-radius:999px; width:{skill.level}%;"></div>
					</div>
				</li>
				{/each}
			</ul>
		</section>
		{/if}

		<!-- Languages -->
		{#if data.languages.length > 0}
		<section style="width:100%;">
			<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
				<div style="flex:1; height:2px; background:#2563eb;"></div>
				<h2 style="font-size:10px; font-weight:700; letter-spacing:0.1em; color:#374151; text-transform:uppercase; padding:0 4px;">Languages</h2>
				<div style="flex:1; height:2px; background:#2563eb;"></div>
			</div>
			<ul style="list-style:none; padding:0; margin:8px 0 0;">
				{#each data.languages as lang}
				<li style="display:flex; justify-content:space-between; margin-bottom:6px;">
					<span style="font-weight:600;">{lang.name}</span>
					<span style="color:#6b7280; font-size:9px;">Write: {lang.writeLevel} | Spoken: {lang.speakLevel}</span>
				</li>
				{/each}
			</ul>
		</section>
		{/if}
	</div>

	<!-- Right main content -->
	<div style="flex:1; padding:32px 24px;">
		<!-- Name & Title -->
		<div style="margin-bottom:20px;">
			<h1 style="font-size:26px; font-weight:700; color:#111827; line-height:1;">{data.name}</h1>
			<p style="font-size:11px; font-weight:600; letter-spacing:0.15em; color:#6b7280; text-transform:uppercase; margin-top:4px;">{data.title}</p>
		</div>

		<!-- About Me -->
		{#if data.about}
		<section style="margin-bottom:20px;">
			<div style="background:#2563eb; color:white; font-weight:700; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; padding:6px 12px; margin-bottom:8px;">About Me</div>
			<p style="font-size:10px; color:#374151; line-height:1.6; white-space:pre-line;">{data.about}</p>
		</section>
		{/if}

		<!-- Work Experience -->
		{#if data.workExperience.length > 0}
		<section style="margin-bottom:20px;">
			<div style="background:#2563eb; color:white; font-weight:700; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; padding:6px 12px; margin-bottom:8px;">Work Experience</div>
			{#each data.workExperience as exp}
			<div style="margin-bottom:12px; page-break-inside:avoid;">
				<div style="font-size:9px; color:#9ca3af;">{exp.startYear} - {exp.endYear}</div>
				<div style="font-weight:700; font-size:10.5px; text-transform:uppercase;">{exp.title}</div>
				<div style="font-size:9.5px; color:#4b5563; margin-bottom:4px;">{exp.company}{exp.location ? ', ' + exp.location : ''}</div>
				{#if exp.description.length > 0}
				<div style="font-weight:600; font-size:9.5px; margin-bottom:2px;">Description:</div>
				<ol style="margin:0 0 0 16px; padding:0;">
					{#each exp.description as point}
					<li style="font-size:9px; color:#374151; margin-bottom:2px;">{point}</li>
					{/each}
				</ol>
				{/if}
				{#if exp.techStack}
				<div style="margin-top:4px;">
					<span style="font-weight:600; font-size:9.5px;">Tech Stack: </span>
					<span style="font-size:9px; color:#374151;">{exp.techStack}</span>
				</div>
				{/if}
			</div>
			{/each}
		</section>
		{/if}

		<!-- Education -->
		{#if data.education.length > 0}
		<section>
			<div style="background:#2563eb; color:white; font-weight:700; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; padding:6px 12px; margin-bottom:8px;">Education</div>
			{#each data.education as edu}
			<div style="margin-bottom:8px;">
				<div style="font-size:9px; color:#9ca3af;">{edu.startYear} - {edu.endYear}</div>
				<div style="font-weight:600; font-size:10px;">{edu.degree || '-'}</div>
				<div style="font-size:9.5px; color:#4b5563;">{edu.institution}</div>
			</div>
			{/each}
		</section>
		{/if}
	</div>
</div>
