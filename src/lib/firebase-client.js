import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const PRODUCTION_DOMAINS = ['leticiavargas.dev', 'leticiavargassite.firebaseapp.com', 'leticiavargassite.web.app'];

const authDomain = typeof window !== 'undefined' && PRODUCTION_DOMAINS.includes(window.location.hostname)
  ? window.location.hostname
  : 'leticiavargassite.firebaseapp.com';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain,
  projectId: 'leticiavargassite',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
