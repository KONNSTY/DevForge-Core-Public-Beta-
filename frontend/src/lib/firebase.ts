// Client-side Firebase Spark Integration with Graceful Local Fallback
// DevForge Core Zero-Secrets Policy: Identifiers are pulled from process.env with zero hardcoding.

export interface FirebaseUserStub {
  uid: string;
  isAnonymous: boolean;
}

export const isFirebaseConfigured = Boolean(
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

/**
 * Initializes anonymous auth if configured in environment, otherwise falls back gracefully to local persistence.
 */
export async function initAnonymousUser(): Promise<FirebaseUserStub | null> {
  if (typeof window === "undefined") return null;

  if (!isFirebaseConfigured) {
    // Generate or retrieve persistent local anonymous id
    let anonId = localStorage.getItem("devforge_anon_uid");
    if (!anonId) {
      anonId = "anon_" + Math.random().toString(36).substring(2, 12);
      localStorage.setItem("devforge_anon_uid", anonId);
    }
    return { uid: anonId, isAnonymous: true };
  }

  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getAuth, signInAnonymously } = await import("firebase/auth");

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);

    if (auth.currentUser) {
      return { uid: auth.currentUser.uid, isAnonymous: auth.currentUser.isAnonymous };
    }

    const cred = await signInAnonymously(auth);
    return { uid: cred.user.uid, isAnonymous: cred.user.isAnonymous };
  } catch (err) {
    console.warn("Firebase Spark connection notice (fallback to local state):", err);
    let anonId = localStorage.getItem("devforge_anon_uid");
    if (!anonId) {
      anonId = "anon_" + Math.random().toString(36).substring(2, 12);
      localStorage.setItem("devforge_anon_uid", anonId);
    }
    return { uid: anonId, isAnonymous: true };
  }
}
