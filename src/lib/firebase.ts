import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
	apiKey: 'AIzaSyDrSK-8ZRzBRvDWqiE5cBOhBDAYrXnh_H0',
	authDomain: 'cv-maker-6e43f.firebaseapp.com',
	databaseURL: 'https://cv-maker-6e43f-default-rtdb.asia-southeast1.firebasedatabase.app',
	projectId: 'cv-maker-6e43f',
	storageBucket: 'cv-maker-6e43f.firebasestorage.app',
	messagingSenderId: '875923550392',
	appId: '1:875923550392:web:d105bc74c0290a4e12044d',
	measurementId: 'G-1EZBRX30F5'
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export const analytics = async () => {
	if (await isSupported()) return getAnalytics(app);
	return null;
};
