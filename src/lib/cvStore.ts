import {
	collection,
	doc,
	addDoc,
	updateDoc,
	deleteDoc,
	getDocs,
	query,
	where,
	orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import type { CV, CVData, TemplateId } from './types';
import { defaultCVData } from './defaultCV';

const COLLECTION = 'cvs';

export async function getCVs(userId: string): Promise<CV[]> {
	const q = query(
		collection(db, COLLECTION),
		where('userId', '==', userId),
		orderBy('updatedAt', 'desc')
	);
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CV);
}

export async function createCV(
	userId: string,
	name: string,
	templateId: TemplateId,
	data?: Partial<CVData>
): Promise<string> {
	const now = Date.now();
	const ref = await addDoc(collection(db, COLLECTION), {
		userId,
		name,
		templateId,
		data: { ...defaultCVData, ...data },
		createdAt: now,
		updatedAt: now
	});
	return ref.id;
}

export async function updateCV(id: string, updates: Partial<Omit<CV, 'id'>>): Promise<void> {
	await updateDoc(doc(db, COLLECTION, id), { ...updates, updatedAt: Date.now() });
}

export async function deleteCV(id: string): Promise<void> {
	await deleteDoc(doc(db, COLLECTION, id));
}
