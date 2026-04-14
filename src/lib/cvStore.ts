import { ref, push, set, update, remove, get } from 'firebase/database';
import { db } from './firebase';
import type { CV, CVData, TemplateId } from './types';
import { blankCVData } from './defaultCV';

function sanitizeCV(id: string, val: any): CV {
	val.data = {
		...blankCVData,
		...val.data,
		skills: val.data?.skills ? Object.values(val.data.skills) : [],
		workExperience: val.data?.workExperience ? Object.values(val.data.workExperience) : [],
		education: val.data?.education ? Object.values(val.data.education) : [],
		languages: val.data?.languages ? Object.values(val.data.languages) : []
	};
	return { id, ...val };
}

export async function getCVs(userId: string): Promise<CV[]> {
	const snap = await get(ref(db, `users/${userId}/cvs`));
	if (!snap.exists()) return [];
	const cvs: CV[] = [];
	snap.forEach((child) => {
		cvs.push(sanitizeCV(child.key as string, child.val()));
	});
	return cvs.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function createCV(
	userId: string,
	name: string,
	templateId: TemplateId
): Promise<string> {
	const now = Date.now();
	const newRef = push(ref(db, `users/${userId}/cvs`));
	await set(newRef, {
		userId,
		name,
		templateId,
		data: blankCVData,
		createdAt: now,
		updatedAt: now
	});
	return newRef.key as string;
}

export async function updateCV(userId: string, id: string, updates: Partial<Omit<CV, 'id'>>): Promise<void> {
	await update(ref(db, `users/${userId}/cvs/${id}`), { ...updates, updatedAt: Date.now() });
}

export async function getCV(userId: string, id: string): Promise<CV | null> {
	const snap = await get(ref(db, `users/${userId}/cvs/${id}`));
	if (!snap.exists()) return null;
	return sanitizeCV(snap.key as string, snap.val());
}

export async function deleteCV(userId: string, id: string): Promise<void> {
	await remove(ref(db, `users/${userId}/cvs/${id}`));
}

export async function duplicateCV(userId: string, id: string): Promise<string> {
	const original = await getCV(userId, id);
	if (!original) throw new Error('CV not found');
	const now = Date.now();
	const newRef = push(ref(db, `users/${userId}/cvs`));
	await set(newRef, {
		userId,
		name: `${original.name} (copy)`,
		templateId: original.templateId,
		data: original.data,
		createdAt: now,
		updatedAt: now
	});
	return newRef.key as string;
}

export async function getPublicCV(userId: string, id: string): Promise<CV | null> {
	return getCV(userId, id);
}
