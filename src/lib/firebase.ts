import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
	apiKey: 'AIzaSyD06ExuuUkhznZz8JQkUIIKFOltf2BWAWM',
	authDomain: 'cloudcomputing-72286.firebaseapp.com',
	databaseURL: 'https://cloudcomputing-72286-default-rtdb.asia-southeast1.firebasedatabase.app',
	projectId: 'cloudcomputing-72286',
	storageBucket: 'cloudcomputing-72286.firebasestorage.app',
	messagingSenderId: '388465197669',
	appId: '1:388465197669:web:fdd6c1e5d02a4e91e8fc8c',
	measurementId: 'G-K1NY2X11P7'
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
