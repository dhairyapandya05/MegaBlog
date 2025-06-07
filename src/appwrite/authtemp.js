import {initializeApp} from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import firebaseConfig from "../firebase/firebase"; // This should export firebaseConfig

// Initialize Firebase
const app = initializeApp(firebaseConfig);
auth;

export class AuthService {
  constructor() {
    this.auth = getAuth(app);
  }

  async createAccount({email, password, name}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Set display name
      if (name) {
        await updateProfile(user, {displayName: name});
      }

      // Auto-login after signup
      return this.login({email, password});
    } catch (error) {
      throw error;
    }
  }

  async login({email, password}) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        resolve(user || null);
      });
    });
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase AuthService :: logout :: error", error);
    }
  }
}

const authService = new AuthService();

export default authService;
