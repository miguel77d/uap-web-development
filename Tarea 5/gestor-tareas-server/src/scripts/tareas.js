/* src/scripts/tareas.js
   ───────────────────────────────────────────────────────── */
   document.addEventListener('DOMContentLoaded', () => {
    /* ───────── 1. Agregar tarea ───────── */
    const formAgregar = document.querySelector('form[action="/agregar"]');
    if (formAgregar) {
      formAgregar.addEventListener('submit', async (e) => {
        e.preventDefault();
        const texto = formAgregar.tarea.value.trim();
        if (!texto) return;
  
        const r = await fetch('/agregar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ tarea: texto })
        });
  
        if (r.ok) {
          formAgregar.reset();
          location.reload();                 // mantiene ?filtro=...
        } else {
          alert('Error al agregar tarea');
        }
      });
    }
  
    /* ───────── 2. Marcar / des-marcar (toggle) ───────── */
    document.querySelectorAll('form[action="/toggle"]').forEach((form) => {
        /* Enviar el formulario automáticamente al tildar / destildar */
        const checkbox = form.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => form.Submit());
      
        /* Interceptar el submit y enviarlo por fetch */
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
      
          const body = new URLSearchParams(new FormData(form)); // index=N
          const r = await fetch('/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
          });
      
          if (r.ok) {
            location.reload();          // recarga manteniendo ?filtro=...
          } else {
            alert('Error al actualizar tarea');
          }
        });
      });
  
    /* ───────── 3. Eliminar UNA tarea ───────── */
    document.querySelectorAll('form[action="/eliminar"]').forEach((f) => {
      f.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = new URLSearchParams(new FormData(f));
  
        const r = await fetch('/eliminar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body
        });
  
        if (r.ok) {
          location.reload();
        } else {
          alert('Error al eliminar tarea');
        }
      });
    });
  
    /* ───────── 4. Eliminar TODAS las completadas ───────── */
    const fDelComp = document.getElementById('form-eliminar-completadas');
    if (fDelComp) {
      fDelComp.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const r = await fetch('/eliminar-completadas', { method: 'POST' });
        if (r.ok) {
          location.reload();
        } else {
          alert('Error al eliminar tareas completadas');
        }
      });
    }
  });
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
  document.querySelectorAll('form[action="/eliminar"]').forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      try {
        const response = await fetch("/eliminar", {
          method: "POST",
          body: new URLSearchParams(formData),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
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