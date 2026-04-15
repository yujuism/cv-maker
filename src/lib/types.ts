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

	// Photo crop position (CSS object-position percentages)
	photoCropX: number; // 0-100, default 50
	photoCropY: number; // 0-100, default 50

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

export type CVStatus = 'draft' | 'active' | 'archived';

export interface CV {
	id: string;
	userId: string;
	name: string;
	templateId: TemplateId;
	status: CVStatus;
	data: CVData;
	createdAt: number;
	updatedAt: number;
}

export interface UserProfile {
	displayName: string;
	bio: string;
	photoUrl: string;
	defaultEmail: string;
	defaultPhone: string;
	defaultAddress: string;
	updatedAt: number;
}
