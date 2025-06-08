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

export class Service {
  constructor() {
    this.db = this.storage = getStorage(app);
  }

  async createPost({title, slug, content, featuredImage, status, userId}) {
    try {
      const postRef = doc(db, POSTS_COLLECTION, slug);
      await setDoc(postRef, {
        title,
        content,
        featuredImage,
        status,
        userId,
        createdAt: new Date(),
      });
      return {slug};
    } catch (error) {
      console.error("FirebaseService :: createPost :: error", error);
    }
  }

  async updatePost(slug, {title, content, featuredImage, status}) {
    try {
      const postRef = doc(db, POSTS_COLLECTION, slug);
      await updateDoc(postRef, {
        title,
        content,
        featuredImage,
        status,
        updatedAt: new Date(),
      });
      return {slug};
    } catch (error) {
      console.error("FirebaseService :: updatePost :: error", error);
    }
  }

  async deletePost(slug) {
    try {
      const postRef = doc(db, POSTS_COLLECTION, slug);
      await deleteDoc(postRef);
      return true;
    } catch (error) {
      console.error("FirebaseService :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      const postRef = doc(db, POSTS_COLLECTION, slug);
      const snapshot = await getDoc(postRef);
      if (snapshot.exists()) {
        return {id: snapshot.id, ...snapshot.data()};
      } else {
        return null;
      }
    } catch (error) {
      console.error("FirebaseService :: getPost :: error", error);
      return null;
    }
  }

  async getPosts(status = "active") {
    try {
      const snapshot = await getDocs(collection(db, POSTS_COLLECTION));
      snapshot.forEach((doc) => {
        console.log("All posts:", doc.id, doc.data());
      });

      const postsQuery = query(
        collection(db, POSTS_COLLECTION),
        where("status", "==", status)
      );
      const querySnapshot = await getDocs(postsQuery);
      const res = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Filtered posts: ", res);
      return res;
    } catch (error) {
      console.error("FirebaseService :: getPosts :: error", error);
      return [];
    }
  }

  // 🔽 File upload methods using Firebase Storage

  async uploadFile(file, path = "uploads") {
    console.log("We are here", file, path);
    try {
      const fileRef = ref(storage, `${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      let response = {
        url: downloadURL,
        path: snapshot.ref.fullPath,
      };
      return response;
    } catch (error) {
      console.error("FirebaseService :: uploadFile :: error", error);
      return null;
    }
  }

  async deleteFile(filePath) {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      console.error("FirebaseService :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileUrl) {
    return fileUrl; // In Firebase, just use the download URL directly
  }
}

const firebaseService = new Service();
export default firebaseService;
