// src/services/auth.service.ts
import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export const AuthService = {
  async signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // const idToken = await userCredential.user.getIdToken();
    // return { idToken, uid: userCredential.user.uid };
    return userCredential.user;
  },

  async signOut() {
    await signOut(auth);
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },
};