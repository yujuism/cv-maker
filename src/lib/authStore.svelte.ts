import {
	onAuthStateChanged,
	signInWithPopup,
	signOut as firebaseSignOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendEmailVerification,
	PhoneAuthProvider,
	RecaptchaVerifier,
	signInWithPhoneNumber,
	type ConfirmationResult
} from 'firebase/auth';
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

export async function registerWithEmail(email: string, password: string) {
	const cred = await createUserWithEmailAndPassword(auth, email, password);
	await sendEmailVerification(cred.user);
	return cred.user;
}

export async function loginWithEmail(email: string, password: string) {
	const cred = await signInWithEmailAndPassword(auth, email, password);
	return cred.user;
}

// Phone OTP
let confirmationResult: ConfirmationResult | null = null;

export function setupRecaptcha(containerId: string) {
	return new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
}

export async function sendOTP(phone: string, recaptcha: RecaptchaVerifier): Promise<void> {
	confirmationResult = await signInWithPhoneNumber(auth, phone, recaptcha);
}

export async function verifyOTP(code: string): Promise<User> {
	if (!confirmationResult) throw new Error('No OTP sent');
	const cred = await confirmationResult.confirm(code);
	return cred.user;
}
