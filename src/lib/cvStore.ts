import { ref, push, set, update, remove, get, query, orderByChild, equalTo } from 'firebase/database';
import { db } from './firebase';
import type { CV, CVData, TemplateId } from './types';
import { defaultCVData } from './defaultCV';

export async function getCVs(userId: string): Promise<CV[]> {
	const q = query(ref(db, 'cvs'), orderByChild('userId'), equalTo(userId));
	const snap = await get(q);
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
	data?: Partial<CVData>
): Promise<string> {
	const now = Date.now();
	const newRef = push(ref(db, 'cvs'));
	await set(newRef, {
		userId,
		name,
		templateId,
		data: { ...defaultCVData, ...data },
		createdAt: now,
		updatedAt: now
	});
	return newRef.key as string;
}

export async function updateCV(id: string, updates: Partial<Omit<CV, 'id'>>): Promise<void> {
	await update(ref(db, `cvs/${id}`), { ...updates, updatedAt: Date.now() });
}

export async function getCV(id: string): Promise<CV | null> {
	const snap = await get(ref(db, `cvs/${id}`));
	if (!snap.exists()) return null;
	return { id: snap.key as string, ...snap.val() };
}

export async function deleteCV(id: string): Promise<void> {
	await remove(ref(db, `cvs/${id}`));
}
