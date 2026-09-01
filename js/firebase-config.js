// Configuração e inicialização do Firebase.
// Todo o resto do app importa deste arquivo em vez de repetir a config.
//
// ⚠️ SUBSTITUA os valores abaixo pela config do SEU projeto Firebase novo
// (Firebase Console → Configurações do projeto → Seus apps → SDK setup).
// Nada aqui é secreto (a apiKey de apps web é pública por natureza), mas
// precisa apontar para o projeto correto do OpenMind, não para o de
// Finanças.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    deleteUser
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD6sh7KtroeWVX22y1eDWMDyYhDBpJoXOI",
    authDomain: "estudos-3b92d.firebaseapp.com",
    projectId: "estudos-3b92d",
    storageBucket: "estudos-3b92d.firebasestorage.app",
    messagingSenderId: "301655339043",
    appId: "1:301655339043:web:50b56cd89c2d4197384196"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    deleteUser,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    addDoc
};
