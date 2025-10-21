// main.js
import { db, auth } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const contenido = document.getElementById("contenido");
  const nav = document.getElementById("nav");

  // Aseguramos que nav exista; si no, creamos uno vacío para evitar errores
  if (!nav) {
    console.warn("Elemento #nav no encontrado en el DOM.");
  }

  // Observador de sesión: única fuente de verdad
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("👤 Usuario activo:", user.email);
      if (nav) nav.style.display = "flex";
      mostrarSeccion("home");
    } else {
      console.log("🚫 No hay usuario activo");
      if (nav) nav.style.display = "none";
      mostrarLogin();
    }
  });

  // ---------------------------
  // LOGIN / REGISTRO (vistas)
  // ---------------------------
  function mostrarLogin(message = "") {
    contenido.innerHTML = `
      <div class="seccion login">
        <h2>🔐 Iniciar Sesión</h2>
        <input type="email" id="emailInput" placeholder="Correo electrónico" />
        <input type="password" id="passwordInput" placeholder="Contraseña" />
        <button id="loginBtn">Entrar</button>
        <p>¿No tienes cuenta? <span id="registrarseLink" class="link">Regístrate aquí</span></p>
        <p id="authMessage" style="color:#ffe4f0">${message}</p>
      </div>
    `;

    const loginBtn = document.getElementById("loginBtn");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const registrarseLink = document.getElementById("registrarseLink");
    const authMessage = document.getElementById("authMessage");

    // enviar con Enter
    [emailInput, passwordInput].forEach(input => {
      input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") loginUsuario();
      });
    });

    loginBtn.addEventListener("click", loginUsuario);
    registrarseLink.addEventListener("click", () => mostrarRegistro());

    async function loginUsuario() {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      authMessage.textContent = "";

      if (!email || !password) {
        authMessage.textContent = "Por favor completa ambos campos.";
        return;
      }
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged se encargará de mostrar la app
      } catch (err) {
        console.error("Login error:", err);
        authMessage.textContent = "Error: " + (err.message || "No se pudo iniciar sesión.");
      }
    }
  }

  function mostrarRegistro(message = "") {
    contenido.innerHTML = `
      <div class="seccion registro">
        <h2>📝 Crear Cuenta</h2>
        <input type="email" id="registroEmail" placeholder="Correo electrónico" />
        <input type="password" id="registroPassword" placeholder="Contraseña (mín. 6 caracteres)" />
        <button id="registroBtn">Registrar</button>
        <p>¿Ya tienes cuenta? <span id="loginLink" class="link">Inicia sesión</span></p>
        <p id="regMessage" style="color:#ffe4f0">${message}</p>
      </div>
    `;

    const registroBtn = document.getElementById("registroBtn");
    const registroEmail = document.getElementById("registroEmail");
    const registroPassword = document.getElementById("registroPassword");
    const loginLink = document.getElementById("loginLink");
    const regMessage = document.getElementById("regMessage");

    // enviar con Enter
    [registroEmail, registroPassword].forEach(input => {
      input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") registrarUsuario();
      });
    });

    registroBtn.addEventListener("click", registrarUsuario);
    loginLink.addEventListener("click", () => mostrarLogin());

    async function registrarUsuario() {
      const email = registroEmail.value.trim();
      const password = registroPassword.value.trim();
      regMessage.textContent = "";

      if (!email || !password) {
        regMessage.textContent = "Por favor completa ambos campos.";
        return;
      }
      if (password.length < 6) {
        regMessage.textContent = "La contraseña debe tener mínimo 6 caracteres.";
        return;
      }

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        // Firebase autentica al crear la cuenta; onAuthStateChanged mostrará la app
      } catch (err) {
        console.error("Registro error:", err);
        regMessage.textContent = "Error: " + (err.message || "No se pudo registrar.");
      }
    }
  }

  // ---------------------------
  // NAVEGACIÓN Y VISTAS PRINCIPALES
  // ---------------------------

  // Asignar listeners de navegación (si existen botones)
  const botones = document.querySelectorAll(".nav-btn");
  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      const section = boton.dataset.section;
      mostrarSeccion(section);
    });
  });

  function mostrarSeccion(seccion) {
    if (seccion === "home") {
      contenido.innerHTML = `
        <div class="seccion home">
          <h2>🏠 Bienvenido a Mis Apuntes</h2>
          <p>Organiza tus ideas, tus clases y tus pensamientos.</p>
        </div>
      `;
    } else if (seccion === "materias") {
      mostrarMaterias();
    } else if (seccion === "frase") {
      const frases = [
        "El conocimiento es poder.",
        "Estudia hoy, brilla mañana.",
        "El éxito es la suma de pequeños esfuerzos diarios.",
        "Aprender nunca ocupa lugar."
      ];
      const random = frases[Math.floor(Math.random() * frases.length)];
      contenido.innerHTML = `
        <div class="seccion frase">
          <h2>💬 Frase del día</h2>
          <p>${random}</p>
        </div>
      `;
    } else if (seccion === "logout") {
      cerrarSesion();
    }
  }

  // ============================
  // MATERIAS
  // ============================
  async function mostrarMaterias() {
    contenido.innerHTML = `
      <div class="seccion materias">
        <h2>📘 Materias</h2>
        <button id="nuevaMateriaBtn">+ Nueva Materia</button>
        <div id="listaMaterias"></div>
      </div>
    `;
    await cargarMaterias();
    document.getElementById("nuevaMateriaBtn").addEventListener("click", abrirModalMateria);
  }

  async function cargarMaterias() {
    const lista = document.getElementById("listaMaterias");
    lista.innerHTML = `<p>Cargando materias...</p>`;
    try {
      const materiasSnap = await getDocs(collection(db, "materias"));
      lista.innerHTML = "";
      materiasSnap.forEach(doc => {
        const div = document.createElement("div");
        div.textContent = doc.data().nombre;
        div.classList.add("materia");
        lista.appendChild(div);
      });
      if (materiasSnap.empty) lista.innerHTML = "<p>No hay materias aún.</p>";
    } catch (e) {
      console.error("❌ Error al cargar materias:", e);
      lista.innerHTML = "<p>Error al conectar con Firestore.</p>";
    }
  }

  // ============================
  // MODAL NUEVA MATERIA
  // ============================
  function abrirModalMateria() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Agregar nueva materia</h3>
        <input type="text" id="nombreMateriaInput" placeholder="Ej: Matemáticas" maxlength="30">
        <div class="modal-buttons">
          <button id="cancelarBtn">Cancelar</button>
          <button id="guardarBtn">Guardar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("cancelarBtn").addEventListener("click", () => modal.remove());
    document.getElementById("guardarBtn").addEventListener("click", guardarMateria);
  }

  async function guardarMateria() {
    const nombre = document.getElementById("nombreMateriaInput").value.trim();
    if (!nombre) return alert("⚠️ Escribe un nombre para la materia.");
    try {
      const materiasSnap = await getDocs(collection(db, "materias"));
      if (materiasSnap.size >= 8) {
        alert("📚 Límite alcanzado (máx. 8 materias).");
        document.querySelector(".modal")?.remove();
        return;
      }
      await addDoc(collection(db, "materias"), { nombre });
      alert("✅ Materia guardada con éxito.");
      document.querySelector(".modal")?.remove();
      mostrarMaterias();
    } catch (e) {
      console.error("❌ Error al guardar:", e);
      alert("Ocurrió un error al guardar la materia.");
    }
  }

  // ---------------------------
  // Cerrar sesión
  // ---------------------------
  function cerrarSesion() {
    signOut(auth)
      .then(() => {
        alert("👋 Sesión cerrada correctamente.");
        // onAuthStateChanged redirigirá a login automáticamente
      })
      .catch((e) => console.error("❌ Error al cerrar sesión:", e));
  }

}); // fin DOMContentLoaded
