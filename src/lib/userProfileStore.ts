import { ref, set, update, get, remove } from 'firebase/database';
import { db } from './firebase';
import type { UserProfile } from './types';

const defaultProfile: UserProfile = {
	displayName: '',
	bio: '',
	photoUrl: '',
	defaultEmail: '',
	defaultPhone: '',
	defaultAddress: '',
	updatedAt: 0
};

export async function createUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
	await set(ref(db, `users/${userId}/profile`), {
		...defaultProfile,
		...data,
		updatedAt: Date.now()
	});
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
	const snap = await get(ref(db, `users/${userId}/profile`));
	if (!snap.exists()) return null;
	return { ...defaultProfile, ...snap.val() };
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
	await update(ref(db, `users/${userId}/profile`), { ...data, updatedAt: Date.now() });
}

export async function deleteUserProfile(userId: string): Promise<void> {
	await remove(ref(db, `users/${userId}/profile`));
}

export async function deleteAccount(userId: string): Promise<void> {
	await remove(ref(db, `users/${userId}`));
}
