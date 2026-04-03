import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

let user = $state<User | null>(null);
let loading = $state(true);

onAuthStateChanged(auth, (u) => {
	user = u;
	loading = false;
});

export function getUser() {
	return user;
}

export function isLoading() {
	return loading;
}

export async function signInWithGoogle() {
	await signInWithPopup(auth, googleProvider);
}

export async function signOut() {
	await firebaseSignOut(auth);
}
