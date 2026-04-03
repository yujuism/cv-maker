import { ref, push, set, update, remove, get } from 'firebase/database';
import { db } from './firebase';
import type { CV, CVData, TemplateId } from './types';
import { defaultCVData, blankCVData } from './defaultCV';

export async function getCVs(userId: string): Promise<CV[]> {
	const snap = await get(ref(db, `users/${userId}/cvs`));
	if (!snap.exists()) return [];
	const cvs: CV[] = [];
	snap.forEach((child) => {
		cvs.push({ id: child.key as string, ...child.val() });
	});
	return cvs.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function createCV(
	userId: string,
	name: string,
	templateId: TemplateId,
	startFrom: 'default' | 'blank' = 'default'
): Promise<string> {
	const now = Date.now();
	const newRef = push(ref(db, `users/${userId}/cvs`));
	await set(newRef, {
		userId,
		name,
		templateId,
		data: startFrom === 'blank' ? blankCVData : defaultCVData,
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
	return { id: snap.key as string, ...snap.val() };
}

export async function deleteCV(userId: string, id: string): Promise<void> {
	await remove(ref(db, `users/${userId}/cvs/${id}`));
}
