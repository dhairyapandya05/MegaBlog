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
import {getAvatarUrl} from "./avartarApi";
import profileservice from "./profile";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export class AuthService {
  async createAccount({email, password, name}) {
    try {
      let avartar = await getAvatarUrl(name);
      console.log("Avatar URL: ", avartar);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Create user profile in Firestore
      let profile = {
        name: name || "Anonymous",
        userId: userCredential.user.uid,
        createdAt: new Date(),
        avartar: avartar || "",
        socialmedaLinks: {},
      };
      let createProfileres = await profileservice.createProfile(profile);
      console.log("createProfileres: ", createProfileres);
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
