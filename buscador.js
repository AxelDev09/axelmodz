const loader = document.getElementById('loader');
const dashboard = document.getElementById('dashboard');
const appGrid = document.getElementById('appGrid');
const searchInput = document.getElementById('searchInput');
const message = document.createElement('div');
const filtroActivo = document.createElement('div');
const limpiarBtn = document.createElement('button');
let cards = [];

// Mostrar loader solo la primera vez
const loaderShown = localStorage.getItem('loaderShown');

if (!loaderShown) {
  loader.style.display = 'flex';
  dashboard.style.display = 'none';
  setTimeout(() => {
    loader.style.display = 'none';
    dashboard.style.display = 'block';
    localStorage.setItem('loaderShown', 'true');
  }, 3000);
} else {
  loader.style.display = 'none';
  dashboard.style.display = 'block';
}

// Mensaje de búsqueda
message.style.color = '#0f0';
message.style.textAlign = 'center';
message.style.marginTop = '20px';
message.style.fontSize = '1em';
appGrid.parentNode.insertBefore(message, appGrid.nextSibling);

// Filtro activo
filtroActivo.style.color = '#0f0';
filtroActivo.style.textAlign = 'center';
filtroActivo.style.marginTop = '10px';
filtroActivo.style.fontSize = '0.9em';
appGrid.parentNode.insertBefore(filtroActivo, message);

// Botón limpiar filtros
limpiarBtn.textContent = 'Limpiar filtros';
limpiarBtn.style.margin = '10px auto';
limpiarBtn.style.padding = '6px 12px';
limpiarBtn.style.border = '1px solid #0f0';
limpiarBtn.style.background = '#000';
limpiarBtn.style.color = '#0f0';
limpiarBtn.style.cursor = 'pointer';
limpiarBtn.style.fontFamily = 'Courier New, monospace';
limpiarBtn.style.textAlign = 'center';
limpiarBtn.style.display = 'none';
appGrid.parentNode.insertBefore(limpiarBtn, filtroActivo);

limpiarBtn.addEventListener('click', () => {
  cards.forEach(card => card.style.display = 'block');
  filtroActivo.textContent = '';
  message.textContent = '';
  limpiarBtn.style.display = 'none';
  searchInput.value = '';
});

// Cargar apps desde JSON
fetch('apps.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(app => {
      const card = document.createElement('a');
      card.className = 'app-card';
      card.href = app.ruta;
      card.setAttribute('data-categoria', app.categoria);
      card.setAttribute('data-etiquetas', app.etiquetas.join(' ').toLowerCase());

      const etiquetasHTML = app.etiquetas.map(tag => `<span class="tag">#${tag}</span>`).join(' ');

      card.innerHTML = `
        <img src="${app.icono}" alt="${app.nombre}">
        <h2>
          ${app.nombre}
          <svg class="verificado-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"/>
          </svg>
        </h2>
        <p>${app.descripcion}</p>
        <div class="tags">${etiquetasHTML}</div>
      `;

      appGrid.appendChild(card);
    });

    // Actualizar lista de tarjetas
    cards = Array.from(document.querySelectorAll('.app-card'));

    // Activar clic en etiquetas (corregido)
    document.querySelectorAll('.tag').forEach(tagElement => {
      tagElement.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const tag = this.textContent.replace('#', '').toLowerCase();
        let matches = 0;

        cards.forEach(card => {
          const etiquetas = card.getAttribute('data-etiquetas');
          if (etiquetas && etiquetas.includes(tag)) {
            card.style.display = 'block';
            matches++;
          } else {
            card.style.display = 'none';
          }
        });

        filtroActivo.textContent = `Filtrando por etiqueta: #${tag}`;
        limpiarBtn.style.display = 'inline-block';
        searchInput.value = '';
        message.textContent = matches === 0 ? 'Sin resultados encontrados.' : '';
      });
    });

    // Activar buscador por nombre o etiqueta (con # incluido)
    searchInput.addEventListener('input', function () {
      const rawQuery = this.value.toLowerCase().trim();
      const query = rawQuery.startsWith('#') ? rawQuery.slice(1) : rawQuery;
      let matches = 0;

      cards.forEach(card => {
        const name = card.querySelector('h2').textContent.toLowerCase();
        const etiquetas = card.getAttribute('data-etiquetas');
        if (name.includes(rawQuery) || (etiquetas && etiquetas.includes(query))) {
          card.style.display = 'block';
          matches++;
        } else {
          card.style.display = 'none';
        }
      });

      filtroActivo.textContent = rawQuery ? `Buscando: ${rawQuery}` : '';
      limpiarBtn.style.display = rawQuery ? 'inline-block' : 'none';
      message.textContent = matches === 0 ? 'Sin resultados encontrados.' : '';
    });
  });

// Menú de tres puntos
const menuToggle = document.getElementById('menu-toggle');
const menuDropdown = document.getElementById('menu-dropdown');

menuToggle.addEventListener('click', () => {
  menuDropdown.style.display = menuDropdown.style.display === 'none' ? 'block' : 'none';
});

function filtrarCategoria(categoria) {
  cards.forEach(card => {
    const tipo = card.getAttribute('data-categoria');
    card.style.display = tipo === categoria ? 'block' : 'none';
  });
  filtroActivo.textContent = `Filtrando por categoría: ${categoria}`;
  limpiarBtn.style.display = 'inline-block';
  searchInput.value = '';
  menuDropdown.style.display = 'none';
  message.textContent = '';
}