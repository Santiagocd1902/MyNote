// assets/js/login.js
import { auth, db } from "./firebase.js";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const container = document.querySelector(".login-container");

// 🔹 Mostrar pantalla de inicio de sesión
function mostrarLogin() {
  container.innerHTML = `
    <h1>MyNote</h1>
    <h2>Iniciar Sesión</h2>

    <input type="email" id="email" placeholder="Correo electrónico">
    <input type="password" id="password" placeholder="Contraseña">

    <button id="loginBtn">Ingresar</button>
    <p>¿No tienes cuenta? <a href="#" id="registrarseLink">Regístrate</a></p>

    <p id="mensaje"></p>
  `;

  document.getElementById("loginBtn").addEventListener("click", loginUsuario);
  document.getElementById("registrarseLink").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarRegistro();
  });
}

// 🔹 Mostrar pantalla de registro (ahora incluye “nombre”)
function mostrarRegistro() {
  container.innerHTML = `
    <h1>MyNote</h1>
    <h2>Crear Cuenta</h2>

    <input type="text" id="nombreRegistro" placeholder="Nombre completo">
    <input type="email" id="emailRegistro" placeholder="Correo electrónico">
    <input type="password" id="passwordRegistro" placeholder="Contraseña">

    <button id="registrarBtn">Registrarme</button>
    <p>¿Ya tienes cuenta? <a href="#" id="volverLogin">Inicia sesión</a></p>

    <p id="mensaje"></p>
  `;

  document.getElementById("registrarBtn").addEventListener("click", registrarUsuario);
  document.getElementById("volverLogin").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarLogin();
  });
}

// 🔹 Función para iniciar sesión
async function loginUsuario() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const mensaje = document.getElementById("mensaje");

  if (!email || !password) {
    mensaje.textContent = "Ingresa todos los campos.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    mensaje.textContent = "✅ Sesión iniciada correctamente.";
    window.location.href = "menu.html"; // Redirige a la app principal
  } catch (error) {
    console.error("Login error:", error);
    mensaje.textContent = "❌ Credenciales incorrectas o usuario no registrado.";
  }
}

// 🔹 Función para registrarse (ahora guarda el nombre)
async function registrarUsuario() {
  const nombre = document.getElementById("nombreRegistro").value.trim();
  const email = document.getElementById("emailRegistro").value.trim();
  const password = document.getElementById("passwordRegistro").value.trim();
  const mensaje = document.getElementById("mensaje");

  if (!nombre || !email || !password) {
    mensaje.textContent = "⚠️ Completa todos los campos.";
    return;
  }

  try {
    // Crear usuario en Firebase Authentication
    const credenciales = await createUserWithEmailAndPassword(auth, email, password);
    const user = credenciales.user;

    // Guardar información adicional en Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      nombre: nombre,
      email: email,
      fechaRegistro: new Date().toISOString()
    });

    mensaje.textContent = "✅ Registro exitoso. Ahora puedes iniciar sesión.";
    setTimeout(mostrarLogin, 2000);
  } catch (error) {
    console.error("Registro error:", error);
    mensaje.textContent = `❌ Error: ${error.message}`;
  }
}

// Mostrar login al cargar
mostrarLogin();
