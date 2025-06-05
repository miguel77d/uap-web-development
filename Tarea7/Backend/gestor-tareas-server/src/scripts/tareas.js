document.addEventListener("DOMContentLoaded", () => {
  const formAgregar = document.querySelector('form[action="/agregar"]');

  if (formAgregar) {
    formAgregar.addEventListener("submit", async (e) => {
      e.preventDefault();

      const input = formAgregar.querySelector("input[name='tarea']");
      const texto = input.value.trim();
      if (!texto) return;

      try {
        const response = await fetch("/agregar", {
          method: "POST",
          body: new URLSearchParams({ tarea: texto }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        if (response.ok) {
          const nuevaTarea = await response.json();
          input.value = "";

          // Crear nuevo <li> con la estructura de la tarea
          const li = document.createElement("li");
          li.className =
            "bg-white border border-gray-300 rounded px-4 py-2 flex items-center justify-between";
          li.innerHTML = `
            <form method="POST" action="/toggle" class="flex items-center gap-2 flex-1">
              <input type="hidden" name="index" value="${nuevaTarea.index}" />
              <input
                type="checkbox"
                name="completada"
                data-action="toggle"
                class="cursor-pointer"
              />
              <span>${nuevaTarea.texto}</span>
            </form>

            <form method="POST" action="/eliminar">
              <input type="hidden" name="index" value="${nuevaTarea.index}" />
              <button type="submit" class="text-red-600 shover:text-red-800">❌</button>
            </form>
          `;

          document.querySelector("ul").appendChild(li);
          reasignarEventos(); // Reasignar eventos al nuevo elemento agregado
        }
      } catch (err) {
        console.error("Error al agregar tarea:", err);
      }
    });
  }

  // ───────── 4. Eliminar TODAS las completadas ─────────
const fDelComp = document.getElementById("form-eliminar-completadas");
if (fDelComp) {
  fDelComp.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const r = await fetch("/eliminar-completadas", { method: "POST" });
      if (r.ok) {
        // ✅ Eliminar del DOM las tareas completadas
        document.querySelectorAll("ul li").forEach((li) => {
          const checkbox = li.querySelector('input[type="checkbox"]');
          if (checkbox?.checked) {
            li.remove();
          }
        });
      } else {
        alert("Error al eliminar tareas completadas");
      }
    } catch (error) {
      console.error("Error al eliminar completadas:", error);
    }
  });
}


  // ───────── 5. Interceptar los clics de los filtros (AJAX) ─────────
  document.querySelectorAll('a[href*="filtro="]').forEach((enlace) => {
    enlace.addEventListener("click", async (e) => {
      e.preventDefault();

      const url = e.currentTarget.href;

      try {
        const response = await fetch(url);
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const nuevaLista = doc.querySelector("ul");

        if (nuevaLista) {
          const contenedorLista = document.querySelector("ul");
          contenedorLista.replaceWith(nuevaLista);

          // ✅ Reasignar eventos a los nuevos elementos
          reasignarEventos();
        }
      } catch (error) {
        console.error("Error al aplicar filtro:", error);
      }
    });
  });

  // ✅ Reasignar eventos iniciales al cargar la página
  reasignarEventos();
});

// ───────── Función para reasignar eventos ─────────
function reasignarEventos() {
  // Toggle (marcar / desmarcar)
  document.querySelectorAll('input[data-action="toggle"]').forEach((checkbox) => {
    checkbox.addEventListener("change", async (e) => {
      const form = checkbox.closest("form");
      const formData = new FormData(form);

      try {
        const response = await fetch("/toggle", {
          method: "POST",
          body: new URLSearchParams(formData),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        if (!response.ok) throw new Error("Error al marcar como completada");

        const span = form.querySelector("span");
        const isChecked = checkbox.checked;

        if (isChecked) {
          span.classList.add("line-through", "text-gray-500");
        } else {
          span.classList.remove("line-through", "text-gray-500");
        }
      } catch (err) {
        console.error("Toggle falló:", err);
      }
    });
  });

  // Eliminar una tarea
  document.querySelectorAll('form[action="/eliminar"]').forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      try {
        const response = await fetch("/eliminar", {
          method: "POST",
          body: new URLSearchParams(formData),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        if (response.ok) {
          form.closest("li").remove();
        } else {
          alert("Error al eliminar tarea");
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    });
  });
}
