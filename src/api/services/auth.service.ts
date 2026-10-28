// src/services/auth.service.ts
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

export const AuthService = {
  async signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // const idToken = await userCredential.user.getIdToken();
    // return { idToken, uid: userCredential.user.uid };
    return userCredential.user;
  },

  // Valida a senha atual do restaurante sem encerrar a sessão.
  async verifyPassword(password: string) {
    const user = auth.currentUser;

    if (!user?.email) {
      throw new Error("Sessão inválida.");
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  },

  async signOut() {
    await signOut(auth);
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },
};