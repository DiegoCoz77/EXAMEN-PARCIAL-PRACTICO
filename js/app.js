/* =========================================================
   Clínica Salud Integral - Comportamiento común
   ========================================================= */

/* ---------- Menús por rol ---------- */
const MENUS = {
  recepcionista: [
    ["Inicio", "inicio.html"],
    ["Registrar paciente", "registrar-paciente.html"],
    ["Reservar cita", "reservar-cita.html"],
    ["Confirmar citas", "confirmar-citas.html"],
    ["Cerrar sesión", "login.html"]
  ],
  paciente: [
    ["Inicio", "inicio.html"],
    ["Reservar cita", "reservar-cita.html"],
    ["Mis citas", "mis-citas.html"],
    ["Cerrar sesión", "login.html"]
  ],
  medico: [
    ["Inicio", "inicio.html"],
    ["Agenda", "agenda-medico.html"],
    ["Atención de cita", "atencion-cita.html"],
    ["Cerrar sesión", "login.html"]
  ],
  administrador: [
    ["Inicio", "inicio.html"],
    ["Horarios de médicos", "horarios-medicos.html"],
    ["Usuarios", "gestion-usuarios.html"],
    ["Cerrar sesión", "login.html"]
  ]
};

/* ---------- Rol de la sesión ---------- */
function obtenerRol() {
  return sessionStorage.getItem("rol") || "recepcionista";
}

/* ---------- Dibujar el menú superior ---------- */
function dibujarMenu() {
  const menu = document.getElementById("menu");
  if (!menu) return;

  const paginaActual = location.pathname.split("/").pop();
  const opciones = MENUS[obtenerRol()];

  menu.innerHTML =
    '<span class="marca">Clínica Salud Integral</span>' +
    opciones.map(([texto, enlace]) => {
      const activo = enlace === paginaActual ? ' class="activo"' : "";
      return '<a href="' + enlace + '"' + activo + ">" + texto + "</a>";
    }).join("");
}

/* ---------- Mostrar solo lo que corresponde al rol ---------- */
function filtrarPorRol() {
  const rol = obtenerRol();
  document.querySelectorAll("[data-solo]").forEach(el => {
    el.hidden = el.dataset.solo !== rol;
  });
}

/* ---------- Login ---------- */
function iniciarLogin() {
  const form = document.getElementById("formLogin");
  if (!form) return;

  sessionStorage.removeItem("rol");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value.trim().toLowerCase();
    const roles = {
      paciente: "paciente",
      medico: "medico",
      admin: "administrador"
    };
    sessionStorage.setItem("rol", roles[usuario] || "recepcionista");
    location.href = "inicio.html";
  });
}

/* ---------- Acciones de botones y formularios ---------- */
function iniciarAcciones() {
  // Botones con mensaje: data-alerta="texto"
  // Opcional: data-quitar (quita la fila de la tabla)
  document.querySelectorAll("[data-alerta]").forEach(boton => {
    boton.addEventListener("click", () => {
      alert(boton.dataset.alerta);
      const fila = boton.closest("tr");
      if (boton.hasAttribute("data-quitar") && fila) fila.remove();
    });
  });

  // Cambiar el estado de una fila: data-estado="Cancelada" data-col="3"
  document.querySelectorAll("[data-estado]").forEach(boton => {
    boton.addEventListener("click", () => {
      const fila = boton.closest("tr");
      fila.cells[Number(boton.dataset.col)].textContent = boton.dataset.estado;
      boton.disabled = true;
    });
  });

  // Llevar el cursor a un campo: data-foco="#id"
  document.querySelectorAll("[data-foco]").forEach(boton => {
    boton.addEventListener("click", () => {
      const campo = document.querySelector(boton.dataset.foco);
      if (campo) {
        campo.scrollIntoView({ behavior: "smooth", block: "center" });
        campo.focus();
      }
    });
  });

  // Formularios con mensaje de éxito: data-ok="texto"
  document.querySelectorAll("form[data-ok]").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      alert(form.dataset.ok);
    });
  });
}

/* ---------- Selección de horario (Reservar cita) ---------- */
function iniciarHorarios() {
  const botones = document.querySelectorAll(".horarios button:not(.ocupado)");
  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      document.querySelectorAll(".horarios .elegido")
        .forEach(b => b.classList.remove("elegido"));
      boton.classList.add("elegido");
    });
  });
}

/* ---------- Arranque ---------- */
document.addEventListener("DOMContentLoaded", () => {
  dibujarMenu();
  filtrarPorRol();
  iniciarLogin();
  iniciarAcciones();
  iniciarHorarios();
});
