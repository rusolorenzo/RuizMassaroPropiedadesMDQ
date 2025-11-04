// assets/js/form-evaluacion.js
(function () {
  const form = document.getElementById('frm-evaluacion');
  if (!form) return;

  const endpoint = form.getAttribute('action'); // Formspree o tu backend
  const btnSubmit = form.querySelector('button[type="submit"]');
  const planInput = document.getElementById('frm-plan');

  // 1) Prefill de plan al venir de los CTAs de precios
  document.querySelectorAll('.js-pick-plan').forEach(a => {
    a.addEventListener('click', () => {
      const plan = a.getAttribute('data-plan') || '';
      if (planInput) planInput.value = plan;
    });
  });

  // 2) Envío con fetch + UX
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validación mínima
    const email = form.querySelector('input[name="email"]');
    const nombre = form.querySelector('input[name="nombre"]');
    if (!email || !email.value || !email.validity.valid || !nombre || !nombre.value) {
      alert('Por favor, completá nombre y un email válido.');
      return;
    }

    // Desactivar UI mientras envía
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Enviando...';
    }

    try {
      const fd = new FormData(form);
      const resp = await fetch(endpoint, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      if (resp.ok) {
        // Reemplazar el form por un mensaje de gracias
        form.outerHTML = `
          <div class="rm-form__success">
            <h3>¡Gracias! Ya recibimos tu solicitud.</h3>
            <p>En breve te contactamos para coordinar la evaluación${
              planInput?.value ? ` del <b>${planInput.value}</b>` : ''
            }.</p>
          </div>`;
        // Opcional: redirigir a /gracias.html
        // setTimeout(()=> location.href='/gracias.html', 1800);
      } else {
        // Si Formspree devuelve error, intento fallback a submit clásico
        console.warn('Fetch no OK, intentando submit estándar...');
        form.removeEventListener('submit', () => {});
        form.submit();
      }
    } catch (err) {
      console.error(err);
      alert('No pudimos enviar en este momento. Intentá nuevamente.');
    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Quiero una evaluación';
      }
    }
  });
})();
