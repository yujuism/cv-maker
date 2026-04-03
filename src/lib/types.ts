export interface Skill {
	name: string;
	level: number; // 0-100
}

export interface WorkExperience {
	id: string;
	startYear: string;
	endYear: string;
	title: string;
	company: string;
	location: string;
	description: string[];
	techStack: string;
}

export interface Education {
	id: string;
	startYear: string;
	endYear: string;
	degree: string;
	institution: string;
}

export interface Language {
	id: string;
	name: string;
	writeLevel: string;
	speakLevel: string;
}

export interface CVData {
	// Personal
	name: string;
	title: string;
	phone: string;
	email: string;
	skype: string;
	address: string;
	linkedin: string;
	photoUrl: string;

	// About
	about: string;

	// Skills
	skills: Skill[];

	// Work Experience
	workExperience: WorkExperience[];

	// Education
	education: Education[];

	// Languages
	languages: Language[];
}

export type TemplateId = 'blue-sidebar' | 'minimal-clean';

export interface CV {
	id: string;
	userId: string;
	name: string; // CV label e.g. "Backend Role", "Game Dev Role"
	templateId: TemplateId;
	data: CVData;
	createdAt: number;
	updatedAt: number;
}
