import {initializeApp} from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import firebaseConfig from "../firebase/firebase";

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Constants
const POSTS_COLLECTION = "posts";

export class CommentService {
  constructor() {
    this.db = this.storage = getStorage(app);
  }

  async createComment(slug, commentData) {
    try {
      const postRef = doc(db, POSTS_COLLECTION, slug);

      // Stringify the comment before storing
      const commentString = JSON.stringify(commentData);

      await setDoc(postRef, {comment: commentString}, {merge: true}); // ✅ stores as string

      return {slug, comment: commentString};
    } catch (error) {
      console.error("FirebaseService :: createComment :: error", error);
    }
  }

  async updateComment(slug, commentData) {
    try {
      const postRef = doc(db, POSTS_COLLECTION, slug);

      // Stringify the comment before storing
      const commentString = JSON.stringify(commentData);

      await setDoc(postRef, {comment: commentString}, {merge: true}); // ✅ stores as string

      return {slug, comment: commentString};
    } catch (error) {
      console.error("FirebaseService :: createComment :: error", error);
    }
  }
}

const firebaseCommentService = new CommentService();
export default firebaseCommentService;
