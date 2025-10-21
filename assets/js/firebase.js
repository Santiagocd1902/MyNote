// Importar SDKs de Firebase desde la CDN moderna (modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDrtqLMPIE-vlWaomS0Mp9J4szRlTuBELg",
  authDomain: "mynote-b2361.firebaseapp.com",
  projectId: "mynote-b2361",
  storageBucket: "mynote-b2361.firebasestorage.app",
  messagingSenderId: "509573488809",
  appId: "1:509573488809:web:7e9b7a8eae79377d7dc9b8",
  measurementId: "G-0EK8SSBC4E"
};

// 🔥 Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// 🧪 Test de conexión
console.log("✅ Firebase inicializado correctamente:", app.name);

// 🔹 Probar la conexión a Firestore
(async () => {
  try {
    const testRef = collection(db, "test");
    const snapshot = await getDocs(testRef);
    console.log("📡 Firestore conectado:", snapshot.empty ? "Colección vacía" : "Datos encontrados");
  } catch (error) {
    console.error("❌ Error al conectar a Firestore:", error);
  }
})();
