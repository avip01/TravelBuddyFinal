import admin from 'firebase-admin';

let firebaseApp: admin.app.App;

export async function initializeFirebase() {
  try {
    if (!admin.apps.length) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      
      if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
        throw new Error('Missing Firebase configuration. Please check your environment variables.');
      }

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      console.log('🔥 Firebase Admin SDK initialized successfully');
    } else {
      firebaseApp = admin.apps[0] as admin.app.App;
      console.log('🔥 Firebase Admin SDK already initialized');
    }
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
}

export function getFirebaseApp() {
  if (!firebaseApp) {
    throw new Error('Firebase has not been initialized. Call initializeFirebase() first.');
  }
  return firebaseApp;
}

export function getAuth() {
  return getFirebaseApp().auth();
}

export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('❌ Error verifying Firebase ID token:', error);
    throw new Error('Invalid or expired token');
  }
}

export async function createCustomToken(uid: string, additionalClaims?: object) {
  try {
    const customToken = await getAuth().createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('❌ Error creating custom token:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const userRecord = await getAuth().getUserByEmail(email);
    return userRecord;
  } catch (error) {
    if ((error as any).code === 'auth/user-not-found') {
      return null;
    }
    console.error('❌ Error getting user by email:', error);
    throw error;
  }
}

export async function createUser(userData: {
  email: string;
  password: string;
  displayName?: string;
}) {
  try {
    const userRecord = await getAuth().createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      emailVerified: false,
    });
    return userRecord;
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
}

export async function deleteUser(uid: string) {
  try {
    await getAuth().deleteUser(uid);
    console.log(`🗑️ Successfully deleted user ${uid}`);
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw error;
  }
} 