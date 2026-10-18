(function(){
  const controlToggle = document.getElementById('controlToggle');
  const controlPanel = document.getElementById('controlPanel');
  const scanlines = document.getElementById('scanlines');
  const optParticles = document.getElementById('optParticles');
  const optParallax = document.getElementById('optParallax');
  const optTilt = document.getElementById('optTilt');
  const optScanlines = document.getElementById('optScanlines');
  const optNeon = document.getElementById('optNeon');

  controlToggle.addEventListener('click', () => {
    controlPanel.classList.toggle('show');
    controlPanel.setAttribute('aria-hidden', !controlPanel.classList.contains('show'));
  });

  document.getElementById('closePanel').addEventListener('click', () => {
    controlPanel.classList.remove('show');
    controlPanel.setAttribute('aria-hidden', 'true');
  });

  optScanlines.addEventListener('change', () => {
    scanlines.classList.toggle('show', optScanlines.checked);
  });

  optNeon.addEventListener('change', () => {
    document.querySelectorAll('.neon').forEach(el => {
      el.style.textShadow = optNeon.checked ? '' : 'none';
    });
  });

  optParticles.addEventListener('change', () => {
    document.getElementById('particlesCanvas').style.display = optParticles.checked ? 'block' : 'none';
  });

  optParallax.addEventListener('change', () => {
    if (window._taichi_parallax_enable) {
      if (optParallax.checked) window._taichi_parallax_enable();
      else window._taichi_parallax_disable();
    }
  });

  optTilt.addEventListener('change', () => {
    if (window._taichi_tilt_enable) {
      if (optTilt.checked) window._taichi_tilt_enable();
      else window._taichi_tilt_disable();
    }
  });

  const optClouds = document.getElementById('optClouds');
  if (optClouds) {
    const cloudsOff = localStorage.getItem('taichi_clouds') === 'off';
    optClouds.checked = !cloudsOff;
    document.body.classList.toggle('clouds-off', cloudsOff);
    optClouds.addEventListener('change', () => {
      document.body.classList.toggle('clouds-off', !optClouds.checked);
      localStorage.setItem('taichi_clouds', optClouds.checked ? 'on' : 'off');
    });
  }

  const images = [
    'images/hero.jpg', 'images/about.jpg', 'images/studio.jpg', 'images/project_portfolio.jpg', 'images/project_portfolio_1.jpg', 'images/project_portfolio_2.jpg',
    'images/project_ui.jpg', 'images/project_ui_1.jpg', 'images/project_ui_2.jpg', 'images/project_ui_3.jpg', 'images/project_ui_4.jpg', 'images/project_ui_5.jpg',
    'images/project_ai.jpg', 'images/project_ai_1.jpg', 'images/ai_image.jpg', 'images/class1.jpg', 'images/class2.jpg', 'images/project_example.jpg',
    'images/fair.jpg', 'images/fair1.jpg', 'images/fair2.jpg', 'images/fair3.jpg', 'images/fair4.jpg', 'images/fair5.jpg', 'images/fair6.jpg',
    'images/iestp1.jpg', 'images/iestp2.jpg', 'images/iestp3.jpg', 'images/iestp4.jpg', 'images/iestp5.jpg', 'images/iestp6.jpg',
    'images/extra1.jpg', 'images/extra2.jpg', 'images/extra3.jpg'
  ];

  const grid = document.getElementById('galleryGrid');
  images.forEach(src => {
    const wrapper = document.createElement('div');
    wrapper.className = 'gallery-item';
    const img = document.createElement('img');
    img.src = src; img.alt = src.replace(/[-_]/g, ' ').replace(/\.jpg$/i, ''); img.className = 'clickable-lightbox'; img.style.objectFit = 'contain'; img.loading = 'lazy'; img.dataset.src = src;
    wrapper.appendChild(img); grid.appendChild(wrapper);
  });

  function bindLightbox() {
    document.querySelectorAll('.clickable-lightbox').forEach(el => {
      el.removeEventListener('click', el._lbhandler || function() {});
      const h = function(){
        const lb = document.getElementById('lightbox');
        const img = document.getElementById('lightboxImg');
        img.src = el.dataset.src || el.src;
        lb.classList.add('show');
        lb.setAttribute('aria-hidden', 'false');
      };
      el._lbhandler = h;
      el.addEventListener('click', h);
    });
  }

  bindLightbox();

  const fileInput = document.getElementById('fileInput');
  const galleryGrid = document.getElementById('galleryGrid');
  const clearBtn = document.getElementById('clearGallery');
  const metaEditor = document.getElementById('metaEditor');
  const metaTitle = document.getElementById('metaTitle');
  const metaDesc = document.getElementById('metaDesc');
  const saveMeta = document.getElementById('saveMeta');
  const cancelMeta = document.getElementById('cancelMeta');

  let imagesData = JSON.parse(localStorage.getItem('taichi_images_v2') || '[]');
  let editingIndex = null;

  function renderStored() {
    galleryGrid.innerHTML = '';
    imagesData.forEach((it, idx) => addImageToGrid(it.src, it.title, it.desc, idx));
    bindLightbox();
  }

  function addImageToGrid(src, title = '', desc = '', idx) {
    const wrapper = document.createElement('div');
    wrapper.className = 'gallery-item';
    wrapper.style.position = 'relative';

    const img = document.createElement('img');
    img.src = src; img.alt = title || src; img.className = 'clickable-lightbox'; img.dataset.src = src; img.loading = 'lazy';

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.title = 'Editar';
    editBtn.style.position = 'absolute';
    editBtn.style.right = '8px';
    editBtn.style.top = '8px';
    editBtn.style.border = 'none';
    editBtn.style.background = 'rgba(255,255,255,0.9)';
    editBtn.style.padding = '6px';
    editBtn.style.borderRadius = '8px';
    editBtn.style.cursor = 'pointer';
    editBtn.addEventListener('click', () => {
      editingIndex = idx;
      metaTitle.value = title || '';
      metaDesc.value = desc || '';
      metaEditor.style.display = 'block';
      metaTitle.focus();
    });

    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.textContent = title || '';

    wrapper.appendChild(img);
    wrapper.appendChild(editBtn);
    wrapper.appendChild(caption);
    galleryGrid.appendChild(wrapper);
  }

  function saveState() {
    localStorage.setItem('taichi_images_v2', JSON.stringify(imagesData));
  }

  if (imagesData.length === 0) {
    document.querySelectorAll('#galleryGrid img').forEach((im) => {
      imagesData.push({ src: im.src, title: im.alt || '', desc: '' });
    });
    saveState();
  }

  galleryGrid.innerHTML = '';
  imagesData.forEach((it, idx) => addImageToGrid(it.src, it.title, it.desc, idx));
  bindLightbox();

  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(ev) {
        const data = ev.target.result;
        imagesData.push({ src: data, title: file.name.replace(/[-_]/g, ' ').replace(/\.jpg$|\.png$/i, ''), desc: '' });
        const idx = imagesData.length - 1;
        addImageToGrid(data, imagesData[idx].title, '', idx);
        bindLightbox();
        saveState();
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  });

  saveMeta.addEventListener('click', () => {
    if (editingIndex == null) return;
    imagesData[editingIndex].title = metaTitle.value;
    imagesData[editingIndex].desc = metaDesc.value;
    saveState();
    metaEditor.style.display = 'none';
    editingIndex = null;
    galleryGrid.innerHTML = '';
    imagesData.forEach((it, idx) => addImageToGrid(it.src, it.title, it.desc, idx));
    bindLightbox();
  });

  cancelMeta.addEventListener('click', () => {
    metaEditor.style.display = 'none';
    editingIndex = null;
  });

  clearBtn.addEventListener('click', () => {
    if (confirm('Limpiar la galería local? (esto borra los datos guardados en este navegador)')) {
      imagesData = [];
      saveState();
      galleryGrid.innerHTML = '';
    }
  });
})();

/* TAICHI19C personal platform */
(function () {
  const stateKey = 'taichi_platform';
  const initialState = { notes: [], lab: [], resources: [], documents: [], trash: [], character: null, characters: [] };
  let state = { ...initialState, ...JSON.parse(localStorage.getItem(stateKey) || '{}') };
  Object.keys(initialState).forEach(key => { if (key !== 'character' && !Array.isArray(state[key])) state[key] = []; });
  if (state.character && !state.characters.length) state.characters = [{ ...state.character, id: id(), template: state.character.template || 'dossier' }];
  let editingNoteId = null;
  let databasePromise;

  function openDatabase() {
    if (!window.indexedDB) return Promise.resolve(null);
    if (!databasePromise) databasePromise = new Promise(resolve => {
      const request = indexedDB.open('taichi19c', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('platform', { keyPath: 'id' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
    return databasePromise;
  }

  function persist() {
    localStorage.setItem(stateKey, JSON.stringify(state));
    openDatabase().then(db => {
      if (!db) return;
      const transaction = db.transaction('platform', 'readwrite');
      transaction.objectStore('platform').put({ id: 'state', value: state, updatedAt: Date.now() });
    });
    renderAll();
  }

  function id() { return `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
  function escapeText(value) { return String(value || '').replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[character])); }
  function formatDate(value) { return new Date(value).toLocaleDateString('es-PE', { day:'2-digit', month:'short', year:'numeric' }); }
  function tags(value) { return String(value || '').split(',').map(item => item.trim()).filter(Boolean).map(item => `<span class="tag">${escapeText(item.startsWith('#') ? item : `#${item}`)}</span>`).join(''); }
  function empty(message) { return `<div class="empty-state">${message}</div>`; }
  function toast(message) {
    let element = document.getElementById('platformToast');
    if (!element) { element = document.createElement('div'); element.id = 'platformToast'; element.className = 'platform-toast'; document.body.appendChild(element); }
    element.textContent = message; element.classList.add('show'); window.clearTimeout(element.timer); element.timer = window.setTimeout(() => element.classList.remove('show'), 2400);
  }

  function showView(view) {
    document.querySelectorAll('.platform-nav').forEach(button => button.classList.toggle('active', button.dataset.view === view));
    document.querySelectorAll('[data-view-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.viewPanel === view));
    document.body.classList.add('route-module');
    window.scrollTo(0, 0);
  }

  const routeViews = { programacion:'lab', notas:'notes', blog:'notes', proyectos:'proyectos', arte:'arte', galeria:'galeria', documentos:'files', recursos:'library', favoritos:'favorites', 'afiche-personaje':'afiche-personaje', configuracion:'settings' };
  function routeTo(route, updateHash = true) {
    const normalized = route.replace(/^#\/?/, '').toLowerCase() || 'inicio';
    document.getElementById('exploreMenu')?.classList.remove('show');
    document.getElementById('exploreMenu')?.setAttribute('aria-hidden', 'true');
    if (updateHash && window.location.hash !== `#/${normalized}`) window.location.hash = `#/${normalized}`;
    document.querySelectorAll('[data-route-link]').forEach(link => link.classList.toggle('current', link.dataset.routeLink === normalized));
    document.body.classList.remove('route-home', 'route-about', 'route-skills', 'route-timeline', 'route-contact', 'route-explore', 'route-workspace', 'route-module');
    document.getElementById('home').style.removeProperty('display');
    document.getElementById('exploreView').style.removeProperty('display');
    const pageRoutes = { inicio:'route-home', 'sobre-mi':'route-about', habilidades:'route-skills', trayectoria:'route-timeline', contacto:'route-contact' };
    if (pageRoutes[normalized]) {
      document.body.classList.add(pageRoutes[normalized]);
      document.querySelectorAll('[data-view-panel]').forEach(panel => panel.classList.remove('active'));
      if (normalized === 'inicio') document.getElementById('home').style.display = 'grid';
      window.scrollTo(0, 0);
      return;
    }
    if (normalized === 'explorar') {
      document.body.classList.add('route-explore');
      document.getElementById('exploreView').style.display = 'flex';
      const menu = document.getElementById('exploreMenu');
      menu.classList.remove('show'); menu.setAttribute('aria-hidden', 'true');
      document.getElementById('exploreTrigger').setAttribute('aria-expanded', 'false');
      window.scrollTo(0, 0);
      return;
    }
    const view = routeViews[normalized] || normalized;
    if (document.querySelector(`[data-view-panel="${view}"]`)) showView(view);
  }

  function renderVisualModules() {
    function bindVisualLightbox() {
      document.querySelectorAll('.workspace-view.active .clickable-lightbox').forEach(element => {
        if (element.dataset.visualBound) return;
        element.dataset.visualBound = 'true';
        element.addEventListener('click', () => { const lightbox = document.getElementById('lightbox'); const image = document.getElementById('lightboxImg'); image.src = element.dataset.src || element.src; lightbox.classList.add('show'); lightbox.setAttribute('aria-hidden', 'false'); });
      });
    }
    const projectCards = [
      ['images/project_portfolio.jpg', 'Portafolio personal', 'Una página visualmente alegre con estética retro y pixel art.', 'Web'],
      ['images/project_ui.jpg', 'Diseño de interfaces', 'Exploración de colores, botones y composición divertida.', 'UI'],
      ['images/project_ai.jpg', 'Creatividad con IA', 'Herramientas inteligentes para idear y mejorar procesos creativos.', 'IA']
    ];
    const imageNames = ['images/hero.jpg','images/about.jpg','images/studio.jpg','images/project_portfolio_1.jpg','images/project_portfolio_2.jpg','images/project_ui_1.jpg','images/project_ui_2.jpg','images/project_ui_3.jpg','images/project_ai_1.jpg','images/ai_image.jpg','images/class1.jpg','images/class2.jpg','images/fair.jpg','images/fair1.jpg','images/fair2.jpg','images/fair3.jpg','images/iestp1.jpg','images/iestp2.jpg','images/extra1.jpg','images/extra2.jpg'];
    const projectList = document.getElementById('projectList');
    const projectSearch = document.getElementById('projectSearch');
    const projectFilter = document.getElementById('projectFilter');
    function paintProjects() {
      const query = (projectSearch.value || '').toLowerCase();
      const filter = projectFilter.value;
      const filtered = projectCards.filter(item => (filter === 'all' || item[3] === filter) && item.join(' ').toLowerCase().includes(query));
      projectList.innerHTML = filtered.map(item => `<article class="project-module-card"><img src="${item[0]}" alt="${item[1]}" class="clickable-lightbox" data-src="${item[0]}"><div class="project-module-body"><h4>${item[1]}</h4><p>${item[2]}</p><span class="badge">${item[3]} · Conservado</span><div class="card-actions"><button type="button" data-go-view="lab">Detalles</button><button type="button" data-favorite="lab" data-id="legacy-${item[1]}">☆ Favorito</button></div></div></article>`).join('');
      bindVisualLightbox();
    }
    projectSearch.addEventListener('input', paintProjects); projectFilter.addEventListener('change', paintProjects); paintProjects();
    document.getElementById('artList').innerHTML = imageNames.slice(0, 10).map((src, index) => `<figure class="art-tile"><img src="${src}" alt="Obra visual ${index + 1}" class="clickable-lightbox" data-src="${src}"><figcaption><strong>${index % 2 ? 'Exploración visual' : 'Composición creativa'}</strong><small>Digital · TAICHI19C</small></figcaption></figure>`).join('');
    document.getElementById('galleryModuleGrid').innerHTML = imageNames.map(src => `<img src="${src}" alt="Imagen de galería ${src}" class="clickable-lightbox" data-src="${src}" loading="lazy">`).join('');
    bindVisualLightbox();
  }

  function renderStats() {
    const values = [['🧩', state.lab.length, 'Proyectos'], ['📝', state.notes.length, 'Notas'], ['📁', state.documents.length, 'Documentos'], ['🔗', state.resources.length, 'Recursos']];
    document.getElementById('statsGrid').innerHTML = values.map(item => `<div class="stat-card"><span>${item[0]} ${item[2]}</span><strong>${item[1]}</strong></div>`).join('');
  }

  function renderNotes() {
    const query = (document.getElementById('noteSearch').value || '').toLowerCase();
    const category = document.getElementById('noteCategory').value;
    const notes = state.notes.filter(note => (category === 'all' || note.category === category) && `${note.title} ${note.content} ${note.tags}`.toLowerCase().includes(query));
    document.getElementById('notesList').innerHTML = notes.length ? notes.map(note => `<article class="note-card"><h4>${escapeText(note.title)}</h4><p>${escapeText(note.content).slice(0, 180)}${note.content.length > 180 ? '...' : ''}</p><div class="item-meta"><span>${escapeText(note.category)}</span><span>${formatDate(note.updatedAt)}</span>${tags(note.tags)}</div><div class="card-actions"><button data-edit-note="${note.id}" type="button">Editar</button><button data-favorite="notes" data-id="${note.id}" type="button">${note.favorite ? '★ Quitar' : '☆ Favorita'}</button><button class="danger" data-trash="notes" data-id="${note.id}" type="button">Eliminar</button></div></article>`).join('') : empty('Aún no hay notas. Crea la primera idea de tu espacio.');
  }

  function renderLab() {
    document.getElementById('labList').innerHTML = state.lab.length ? state.lab.map(item => `<article class="resource-card"><span class="resource-type">💻 ${escapeText(item.language || 'Código')}</span><h4>${escapeText(item.title)}</h4><p>${escapeText(item.description || 'Sin descripción')}</p><div class="item-meta"><span>${escapeText(item.status)}</span><span>${formatDate(item.createdAt)}</span></div><div class="card-actions">${item.link ? `<a href="${escapeText(item.link)}" target="_blank" rel="noopener">Abrir</a>` : ''}<button data-favorite="lab" data-id="${item.id}" type="button">${item.favorite ? '★' : '☆'} Favorito</button><button class="danger" data-trash="lab" data-id="${item.id}" type="button">Eliminar</button></div></article>`).join('') : empty('Tus proyectos de código aparecerán aquí.');
  }

  function renderResources() {
    document.getElementById('resourceList').innerHTML = state.resources.length ? state.resources.map(item => `<article class="resource-card"><span class="resource-type">🔗 ${escapeText(item.type)}</span><h4>${escapeText(item.title)}</h4><p>${escapeText(item.description || 'Sin descripción')}</p><span class="item-meta">${escapeText(item.category || 'Sin categoría')} · ${formatDate(item.createdAt)}</span><a href="${escapeText(item.url)}" target="_blank" rel="noopener">${escapeText(item.url)}</a><div class="card-actions"><button data-favorite="resources" data-id="${item.id}" type="button">${item.favorite ? '★' : '☆'} Favorito</button><button class="danger" data-trash="resources" data-id="${item.id}" type="button">Eliminar</button></div></article>`).join('') : empty('Guarda documentación, cursos, herramientas o inspiración.');
  }

  function renderDocuments() {
    document.getElementById('documentList').innerHTML = state.documents.length ? state.documents.map(item => `<article class="resource-card"><span class="resource-type">📄 ${escapeText(item.type)}</span><h4>${escapeText(item.name)}</h4><p>${(item.size / 1024).toFixed(1)} KB · ${formatDate(item.createdAt)}</p><div class="card-actions"><button data-favorite="documents" data-id="${item.id}" type="button">${item.favorite ? '★' : '☆'} Favorito</button><button class="danger" data-trash="documents" data-id="${item.id}" type="button">Eliminar</button></div></article>`).join('') : empty('Importa un PDF, DOCX, TXT, JSON o imagen para verlo organizado.');
  }

  function renderFavorites() {
    const favorites = Object.entries(state).filter(([key]) => ['notes', 'lab', 'resources', 'documents'].includes(key)).flatMap(([type, items]) => items.filter(item => item.favorite).map(item => ({ ...item, type })));
    document.getElementById('favoriteList').innerHTML = favorites.length ? favorites.map(item => `<article class="resource-card"><span class="resource-type">⭐ ${escapeText(item.type)}</span><h4>${escapeText(item.title || item.name)}</h4><p>${escapeText(item.description || item.category || '')}</p><div class="card-actions"><button data-favorite="${item.type}" data-id="${item.id}" type="button">★ Quitar</button></div></article>`).join('') : empty('Marca una nota, proyecto, recurso o documento como favorito.');
  }

  function renderTrash() {
    document.getElementById('trashList').innerHTML = state.trash.length ? state.trash.map(item => `<article class="resource-card"><span class="resource-type">${escapeText(item.type)}</span><h4>${escapeText(item.title || item.name)}</h4><div class="card-actions"><button data-restore="${item.id}" type="button">Restaurar</button><button class="danger" data-delete-forever="${item.id}" type="button">Eliminar definitivamente</button></div></article>`).join('') : empty('La papelera está vacía.');
  }

  function renderCharacter(previewCharacter = state.character) {
    const poster = document.getElementById('characterPoster');
    const character = previewCharacter;
    if (!character) { poster.className = 'character-poster'; poster.innerHTML = '<div class="empty-state ficha-empty"><strong>Tu primera ficha empieza aquí</strong><br><span>Agrega nombre, historia, colores, fotos e imagen para crear una ficha de personaje única.</span></div>'; return; }
    const shape = character.imageShape || 'portrait';
    poster.className = 'character-poster has-poster ficha template-' + (character.theme || 'dossier') + (character.backgroundType === 'pattern' ? ' is-pattern' : '');
    poster.style.setProperty('--poster-bg', character.background || '#dff3ff');
    poster.style.setProperty('--poster-secondary', character.secondary || '#ffffff');
    poster.style.setProperty('--poster-accent', character.accent || '#1768b4');
    poster.style.setProperty('--poster-text', character.text || '#18325f');
    const stickers = Array.isArray(character.stickers) ? character.stickers : [];
    const gallery = Array.isArray(character.gallery) ? character.gallery : [];
    const stats = [['Fuerza', character.statStrength], ['Inteligencia', character.statIntelligence], ['Velocidad', character.statSpeed], ['Carisma', character.statCharisma]].filter(function (p) { return p[1] !== undefined && p[1] !== null && p[1] !== ''; });
    const infoPairs = [['Edad', character.age], ['Género', character.gender], ['Nacionalidad', character.nationality], ['Ocupación', character.occupation], ['Rol', character.role], ['Personalidad', character.personality], ['Cabello', character.hair], ['Ojos', character.eyes], ['Vestimenta', character.outfit], ['Accesorios', character.accessories]];
    const stickerHtml = stickers.length ? '<div class="ficha-stickers">' + stickers.map(function (st) { const d = typeof st === 'string' ? { s: st, x: 12, y: 12 } : st; return '<span style="left:' + (d.x ?? 12) + '%;top:' + (d.y ?? 12) + '%">' + escapeText(d.s || '') + '</span>'; }).join('') + '</div>' : '';
    poster.innerHTML = stickerHtml +
      '<header class="ficha-header"><span class="ficha-kicker">' + escapeText(character.role || 'FICHA DE PERSONAJE') + '</span><h2 class="ficha-name">' + escapeText(character.name || 'Personaje sin nombre') + '</h2>' + (character.nickname ? '<p class="ficha-nickname">“' + escapeText(character.nickname) + '”</p>' : '') + '</header>' +
      '<div class="ficha-body">' +
        '<aside class="ficha-portrait-col"><div class="ficha-portrait shape-' + shape + '">' + (character.image ? '<img src="' + character.image + '" alt="Imagen de ' + escapeText(character.name || 'personaje') + '">' : '<div class="ficha-placeholder">🎭<small>Agrega una imagen</small></div>') + '</div>' +
        (stats.length ? '<div class="ficha-stats">' + stats.map(function (p) { const v = Math.max(0, Math.min(100, Number(p[1]) || 0)); return '<div class="ficha-stat"><span class="ficha-stat-label">' + escapeText(p[0]) + '</span><span class="ficha-stat-bar"><i style="width:' + v + '%"></i></span><span class="ficha-stat-value">' + v + '</span></div>'; }).join('') + '</div>' : '') +
        '</aside>' +
        '<div class="ficha-main-col">' +
          '<div class="ficha-info-grid">' + infoPairs.map(function (p) { return '<div class="ficha-info"><small>' + escapeText(p[0]) + '</small><strong>' + escapeText(p[1] || '—') + '</strong></div>'; }).join('') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="ficha-details">' +
        (character.description ? '<section class="ficha-detail"><h4>Descripción</h4><p>' + escapeText(character.description) + '</p></section>' : '') +
        (character.story ? '<section class="ficha-detail"><h4>Historia</h4><p>' + escapeText(character.story) + '</p></section>' : '') +
        (character.strengths ? '<section class="ficha-detail"><h4>Fortalezas</h4><p>' + escapeText(character.strengths) + '</p></section>' : '') +
        (character.weaknesses ? '<section class="ficha-detail"><h4>Debilidades</h4><p>' + escapeText(character.weaknesses) + '</p></section>' : '') +
        (character.goals ? '<section class="ficha-detail"><h4>Objetivos</h4><p>' + escapeText(character.goals) + '</p></section>' : '') +
        (character.relations ? '<section class="ficha-detail"><h4>Relaciones</h4><p>' + escapeText(character.relations) + '</p></section>' : '') +
      '</div>' +
      (gallery.length ? '<section class="ficha-gallery"><h4>Galería</h4><div class="ficha-gallery-grid">' + gallery.map(function (src) { return '<img src="' + src + '" alt="Galería de ' + escapeText(character.name || 'personaje') + '">'; }).join('') + '</div></section>' : '');
  }

  let decoratingCharacterPoster = false;
  const characterPosterObserver = new MutationObserver(() => {
    if (decoratingCharacterPoster) return;
    decoratingCharacterPoster = true;
    const poster = document.getElementById('characterPoster');
    if (!poster.querySelector('.character-poster-header')) return;
    poster.querySelectorAll('.character-poster-decor, .character-poster-grid').forEach(element => element.remove());
    const character = state.character || {};
    if (character.decorationGrid === true || character.decorationGrid === 'true') poster.insertAdjacentHTML('afterbegin', '<span class="character-poster-grid" aria-hidden="true"></span>');
    const decorations = [];
    if (character.decorationStars !== false && character.decorationStars !== 'false') decorations.push('✦');
    if (character.decorationHearts === true || character.decorationHearts === 'true') decorations.push('♡');
    decorations.forEach((symbol, index) => poster.insertAdjacentHTML('beforeend', `<span class="character-poster-decor ${['one','two','three'][index] || 'three'}" aria-hidden="true">${symbol}</span>`));
    decoratingCharacterPoster = false;
  });
  characterPosterObserver.observe(document.getElementById('characterPoster'), { childList:true });

  function renderCharacterLibrary() {
    const library = document.getElementById('characterLibrary');
    if (!state.characters.length) { library.innerHTML = empty('🎭<br><strong>Todavía no tienes afiches</strong><br>Crea tu primer personaje y empieza a diseñarlo.'); return; }
    library.innerHTML = `<div class="character-library-heading"><span class="view-kicker">MIS PERSONAJES</span><span>${state.characters.length} afiche${state.characters.length === 1 ? '' : 's'}</span></div><div class="character-library-grid">${state.characters.map(character => `<article class="character-card"><div class="character-card-image">${character.image ? `<img src="${character.image}" alt="${escapeText(character.name || 'Personaje')}">` : '<span>🎭</span>'}</div><div class="character-card-body"><span class="resource-type">${escapeText(character.template || 'dossier')}</span><h4>${escapeText(character.name || 'Sin nombre')}</h4><p>${escapeText(character.occupation || character.description || 'Sin descripción')}</p><div class="card-actions"><button data-edit-character="${character.id}" type="button">✏️ Editar</button><button data-duplicate-character="${character.id}" type="button">📋 Duplicar</button><button data-favorite-character="${character.id}" type="button">${character.favorite ? '★' : '☆'}</button><button class="danger" data-delete-character="${character.id}" type="button">🗑️</button></div></div></article>`).join('')}</div>`;
  }

  function renderAll() { renderStats(); renderNotes(); renderLab(); renderResources(); renderDocuments(); renderFavorites(); renderTrash(); renderCharacterLibrary(); renderCharacter(); }
  function resetNoteForm() { editingNoteId = null; document.getElementById('noteForm').reset(); document.getElementById('noteFormTitle').textContent = 'Nueva nota'; }
  function toggleForm(id, visible) { document.getElementById(id).classList.toggle('hidden', !visible); if (visible) document.getElementById(id).querySelector('input')?.focus(); }

  document.querySelectorAll('.platform-nav').forEach(button => button.addEventListener('click', () => { const route = Object.entries(routeViews).find(([, view]) => view === button.dataset.view)?.[0] || button.dataset.view; routeTo(route); }));
  document.querySelectorAll('[data-go-view]').forEach(button => button.addEventListener('click', () => { const route = Object.entries(routeViews).find(([, view]) => view === button.dataset.goView)?.[0] || button.dataset.goView; routeTo(route); }));
  document.querySelectorAll('[data-route-link]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); routeTo(link.dataset.routeLink); }));
  document.getElementById('exploreTrigger').addEventListener('click', () => routeTo('explorar'));
  document.getElementById('closeExplore').addEventListener('click', () => routeTo('inicio'));
  document.getElementById('topThemeBtn').addEventListener('click', () => document.getElementById('themeBtn').click());
  document.getElementById('topSettingsBtn').addEventListener('click', () => routeTo('configuracion'));
  document.getElementById('profileToggle').addEventListener('click', () => { const editor = document.getElementById('profileEditor'); editor.style.display = editor.style.display === 'none' ? 'block' : 'none'; });
  document.getElementById('routeBack').addEventListener('click', () => routeTo('explorar'));
  document.getElementById('openNoteBtn').addEventListener('click', () => { showView('notes'); resetNoteForm(); document.getElementById('noteTitle').focus(); });
  document.getElementById('newNoteInline').addEventListener('click', () => { resetNoteForm(); document.getElementById('noteTitle').focus(); });
  document.getElementById('cancelNote').addEventListener('click', resetNoteForm);
  document.getElementById('noteSearch').addEventListener('input', renderNotes);
  document.getElementById('noteCategory').addEventListener('change', renderNotes);
  document.getElementById('noteForm').addEventListener('submit', event => { event.preventDefault(); const current = state.notes.find(note => note.id === editingNoteId); const note = { id: editingNoteId || id(), title: document.getElementById('noteTitle').value.trim(), category: document.getElementById('noteCategoryInput').value, content: document.getElementById('noteContent').value.trim(), tags: document.getElementById('noteTags').value.trim(), createdAt: current?.createdAt || Date.now(), updatedAt: Date.now(), favorite: current?.favorite || false }; state.notes = editingNoteId ? state.notes.map(item => item.id === editingNoteId ? note : item) : [note, ...state.notes]; persist(); resetNoteForm(); toast('Nota guardada'); });
  document.getElementById('newLabBtn').addEventListener('click', () => toggleForm('labForm', true)); document.getElementById('cancelLab').addEventListener('click', () => toggleForm('labForm', false));
  document.getElementById('labForm').addEventListener('submit', event => { event.preventDefault(); state.lab.unshift({ id:id(), title:document.getElementById('labTitle').value.trim(), description:document.getElementById('labDescription').value.trim(), language:document.getElementById('labLanguage').value.trim(), status:document.getElementById('labStatus').value, link:document.getElementById('labLink').value.trim(), createdAt:Date.now(), favorite:false }); persist(); event.target.reset(); toggleForm('labForm', false); toast('Proyecto agregado'); });
  document.getElementById('newResourceBtn').addEventListener('click', () => toggleForm('resourceForm', true)); document.getElementById('cancelResource').addEventListener('click', () => toggleForm('resourceForm', false));
  document.getElementById('resourceForm').addEventListener('submit', event => { event.preventDefault(); state.resources.unshift({ id:id(), title:document.getElementById('resourceTitle').value.trim(), description:document.getElementById('resourceDescription').value.trim(), type:document.getElementById('resourceType').value, category:document.getElementById('resourceCategory').value.trim(), url:document.getElementById('resourceUrl').value.trim(), createdAt:Date.now(), favorite:false }); persist(); event.target.reset(); toggleForm('resourceForm', false); toast('Recurso guardado'); });
  document.getElementById('documentInput').addEventListener('change', event => { Array.from(event.target.files).forEach(file => state.documents.unshift({ id:id(), name:file.name, type:file.type || file.name.split('.').pop().toUpperCase(), size:file.size, createdAt:Date.now(), favorite:false })); persist(); event.target.value = ''; toast('Archivo agregado'); });
  document.addEventListener('click', event => { const image = event.target.closest('.workspace-view .clickable-lightbox'); if (!image) return; const lightbox = document.getElementById('lightbox'); document.getElementById('lightboxImg').src = image.dataset.src || image.src; lightbox.classList.add('show'); lightbox.setAttribute('aria-hidden', 'false'); });
  document.addEventListener('click', event => { const edit = event.target.closest('[data-edit-note]'); if (edit) { const note = state.notes.find(item => item.id === edit.dataset.editNote); if (!note) return; editingNoteId = note.id; document.getElementById('noteTitle').value = note.title; document.getElementById('noteCategoryInput').value = note.category; document.getElementById('noteContent').value = note.content; document.getElementById('noteTags').value = note.tags; document.getElementById('noteFormTitle').textContent = 'Editar nota'; document.getElementById('noteTitle').focus(); return; } const favorite = event.target.closest('[data-favorite]'); if (favorite) { const list = state[favorite.dataset.favorite]; const item = list?.find(entry => entry.id === favorite.dataset.id); if (item) item.favorite = !item.favorite; persist(); return; } const trash = event.target.closest('[data-trash]'); if (trash) { const list = state[trash.dataset.trash]; const index = list.findIndex(entry => entry.id === trash.dataset.id); if (index >= 0) { state.trash.unshift({ ...list[index], type:trash.dataset.trash }); list.splice(index, 1); persist(); toast('Elemento enviado a la papelera'); } return; } const restore = event.target.closest('[data-restore]'); if (restore) { const index = state.trash.findIndex(item => item.id === restore.dataset.restore); if (index >= 0) { const item = state.trash.splice(index, 1)[0]; const type = item.type; delete item.type; state[type].unshift(item); persist(); toast('Elemento restaurado'); } return; } const forever = event.target.closest('[data-delete-forever]'); if (forever) { state.trash = state.trash.filter(item => item.id !== forever.dataset.deleteForever); persist(); toast('Elemento eliminado'); } });
  document.getElementById('emptyTrash').addEventListener('click', () => { if (state.trash.length && confirm('¿Vaciar la papelera definitivamente?')) { state.trash = []; persist(); toast('Papelera vacía'); } });
  document.getElementById('globalSearch').addEventListener('input', event => { const query = event.target.value.trim().toLowerCase(); if (!query) return; const matches = state.notes.filter(item => `${item.title} ${item.content}`.toLowerCase().includes(query)); showView('notes'); document.getElementById('noteSearch').value = query; renderNotes(); if (!matches.length) toast('Sin coincidencias en tus notas'); });
  function setTheme(dark) { document.body.classList.toggle('dark-platform', dark); document.getElementById('darkModeToggle').checked = dark; document.getElementById('themeBtn').textContent = dark ? '☀️' : '🌙'; localStorage.setItem('taichi_theme', dark ? 'dark' : 'light'); }
  document.getElementById('themeBtn').addEventListener('click', () => setTheme(!document.body.classList.contains('dark-platform'))); document.getElementById('darkModeToggle').addEventListener('change', event => setTheme(event.target.checked));
  document.getElementById('motionToggle').addEventListener('change', event => document.body.classList.toggle('reduced-motion', !event.target.checked));
  document.getElementById('clearPlatformData').addEventListener('click', () => { if (confirm('¿Restablecer notas, proyectos, recursos y documentos de esta plataforma?')) { state = { ...initialState, trash:[] }; persist(); toast('Datos restablecidos'); } });
  document.getElementById('exportBtn').addEventListener('click', () => { const blob = new Blob([JSON.stringify(state, null, 2)], { type:'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'taichi19c-datos.json'; link.click(); URL.revokeObjectURL(link.href); toast('Datos exportados'); });
  document.getElementById('importBtn').addEventListener('change', event => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const incoming = JSON.parse(reader.result); state = { ...initialState, ...incoming }; persist(); toast('Datos importados'); } catch { toast('El archivo JSON no es válido'); } }; reader.readAsText(file); event.target.value = ''; });
  function ensureAdvancedCharacterControls() {
    const form = document.getElementById('characterForm');
    const anchor = document.getElementById('characterImage').parentElement;
    if (document.getElementById('characterAdvancedFields')) return;
    const panel = document.createElement('div');
    panel.id = 'characterAdvancedFields';
    panel.innerHTML = `<div class="character-appearance-grid"><label>Color secundario<input id="characterSecondary" type="color" value="#ffffff"></label><label>Color de texto<input id="characterText" type="color" value="#18325f"></label><label>Forma de imagen<select id="characterImageShape"><option value="portrait">Retrato</option><option value="square">Cuadrada</option><option value="circle">Circular</option><option value="polaroid">Polaroid</option></select></label><label>Tipo de fondo<select id="characterBackgroundType"><option value="solid">Color sólido</option><option value="gradient">Degradado</option><option value="pattern">Patrón suave</option></select></label></div><div class="character-columns"><label>Conflictos internos y externos<textarea id="characterConflicts" rows="3"></textarea></label><label>Frases del personaje<textarea id="characterQuotes" rows="3"></textarea></label></div><fieldset class="character-decoration-tools"><legend>✨ Decoraciones</legend><label><input id="decorationStars" type="checkbox" checked> Estrellas</label><label><input id="decorationHearts" type="checkbox"> Corazones</label><label><input id="decorationGrid" type="checkbox"> Retícula</label></fieldset><fieldset class="character-stats"><legend>📊 Habilidades</legend><div class="stat-inputs"><label>Fuerza<input id="statStrength" type="range" min="0" max="100" value="50"></label><label>Inteligencia<input id="statIntelligence" type="range" min="0" max="100" value="50"></label><label>Velocidad<input id="statSpeed" type="range" min="0" max="100" value="50"></label><label>Carisma<input id="statCharisma" type="range" min="0" max="100" value="50"></label></div></fieldset>`;
    form.insertBefore(panel, anchor);
    const removeButton = document.createElement('button');
    removeButton.type = 'button'; removeButton.id = 'removeCharacterImage'; removeButton.className = 'platform-btn platform-btn-light'; removeButton.textContent = 'Quitar imagen';
    anchor.insertAdjacentElement('afterend', removeButton);
    removeButton.addEventListener('click', () => { state.character = { ...(state.character || {}), image:'' }; renderCharacter({ ...(state.character || {}), image:'' }); });
  }
  ensureAdvancedCharacterControls();
  const characterFields = { name:'characterName', nickname:'characterNickname', age:'characterAge', birthdate:'characterBirthdate', zodiac:'characterZodiac', gender:'characterGender', pronouns:'characterPronouns', nationality:'characterNationality', species:'characterSpecies', occupation:'characterOccupation', role:'characterRole', organization:'characterOrganization', personality:'characterPersonality', archetype:'characterArchetype', height:'characterHeight', weight:'characterWeight', build:'characterBuild', skin:'characterSkin', hair:'characterHair', eyes:'characterEyes', hairStyle:'characterHairStyle', outfit:'characterOutfit', accessories:'characterAccessories', special:'characterSpecial', description:'characterDescription', story:'characterStory', strengths:'characterStrengths', weaknesses:'characterWeaknesses', goals:'characterGoals', interests:'characterInterests', relations:'characterRelations', conflicts:'characterConflicts', quotes:'characterQuotes', extras:'characterExtras' };
  const characterAppearanceFields = { secondary:'characterSecondary', text:'characterText', imageShape:'characterImageShape', backgroundType:'characterBackgroundType', decorationStars:'decorationStars', decorationHearts:'decorationHearts', decorationGrid:'decorationGrid', statStrength:'statStrength', statIntelligence:'statIntelligence', statSpeed:'statSpeed', statCharisma:'statCharisma' };
  let editingCharacterId = null;
  function fillCharacterForm(character = {}) { Object.entries(characterFields).forEach(([key, fieldId]) => { const field = document.getElementById(fieldId); if (field) field.value = character[key] || ''; }); document.getElementById('characterBg').value = character.background || '#dff3ff'; document.getElementById('characterAccent').value = character.accent || '#1768b4'; document.getElementById('characterTheme').value = character.theme || 'dossier'; Object.entries(characterAppearanceFields).forEach(([key, fieldId]) => { const field = document.getElementById(fieldId); if (!field) return; field.type === 'checkbox' ? field.checked = character[key] !== false : field.value = character[key] ?? field.value; }); }
  function openCharacterEditor(character = {}, template = 'dossier') { editingCharacterId = character.id || null; fillCharacterForm({ ...character, theme:template }); document.getElementById('templateChooser').classList.add('hidden'); document.getElementById('characterLibrary').classList.add('hidden'); document.getElementById('characterEditorLayout').classList.remove('hidden'); renderCharacter({ ...character, theme:template }); document.getElementById('characterName').focus(); }
  document.getElementById('newCharacterBtn').addEventListener('click', () => { document.getElementById('templateChooser').classList.remove('hidden'); document.getElementById('characterLibrary').classList.add('hidden'); });
  document.querySelectorAll('[data-template]').forEach(button => button.addEventListener('click', () => openCharacterEditor({}, button.dataset.template)));
  document.getElementById('cancelTemplate').addEventListener('click', () => { document.getElementById('templateChooser').classList.add('hidden'); document.getElementById('characterLibrary').classList.remove('hidden'); });
  document.getElementById('cancelCharacter').addEventListener('click', () => { document.getElementById('characterEditorLayout').classList.add('hidden'); document.getElementById('characterLibrary').classList.remove('hidden'); });
  function readCharacterImage(file) { if (!file || !file.type.startsWith('image/')) return; const reader = new FileReader(); reader.onload = event => { const current = state.characters.find(item => item.id === editingCharacterId) || {}; const next = { ...current, image:event.target.result }; if (editingCharacterId) state.characters = state.characters.map(item => item.id === editingCharacterId ? next : item); state.character = next; renderCharacter(next); }; reader.readAsDataURL(file); }
  document.getElementById('characterImage').addEventListener('change', event => readCharacterImage(event.target.files[0]));
  const characterDropzone = document.getElementById('characterDropzone');
  characterDropzone.addEventListener('dragover', event => { event.preventDefault(); characterDropzone.classList.add('dragover'); });
  characterDropzone.addEventListener('dragleave', () => characterDropzone.classList.remove('dragover'));
  characterDropzone.addEventListener('drop', event => { event.preventDefault(); characterDropzone.classList.remove('dragover'); readCharacterImage(event.dataTransfer.files[0]); });
  function readCharacterDraft() { const draft = { ...(state.character || {}) }; Object.entries(characterFields).forEach(([key, fieldId]) => { draft[key] = document.getElementById(fieldId)?.value || ''; }); Object.entries(characterAppearanceFields).forEach(([key, fieldId]) => { const field = document.getElementById(fieldId); if (field) draft[key] = field.type === 'checkbox' ? field.checked : field.value; }); draft.background = document.getElementById('characterBg').value; draft.accent = document.getElementById('characterAccent').value; draft.theme = document.getElementById('characterTheme').value; return draft; }
  document.getElementById('characterForm').addEventListener('submit', event => { event.preventDefault(); const current = state.characters.find(item => item.id === editingCharacterId) || state.character || {}; const next = { ...current, ...readCharacterDraft(), id:editingCharacterId || id(), template:document.getElementById('characterTheme').value, updatedAt:Date.now() }; state.characters = editingCharacterId ? state.characters.map(item => item.id === editingCharacterId ? next : item) : [next, ...state.characters]; state.character = next; persist(); document.getElementById('characterEditorLayout').classList.add('hidden'); document.getElementById('characterLibrary').classList.remove('hidden'); toast('Personaje guardado'); });
  [...Object.values(characterFields), ...Object.values(characterAppearanceFields), 'characterBg', 'characterAccent', 'characterTheme'].forEach(fieldId => document.getElementById(fieldId)?.addEventListener('input', () => renderCharacter(readCharacterDraft())));
  document.getElementById('characterBg').addEventListener('input', () => document.getElementById('characterForm').dispatchEvent(new Event('input')));
  document.getElementById('characterAccent').addEventListener('input', () => document.getElementById('characterForm').dispatchEvent(new Event('input')));
  document.getElementById('characterTheme').addEventListener('change', () => renderCharacter(readCharacterDraft()));
  document.addEventListener('click', event => { const edit = event.target.closest('[data-edit-character]'); if (edit) { const character = state.characters.find(item => item.id === edit.dataset.editCharacter); if (character) openCharacterEditor(character, character.template); return; } const duplicate = event.target.closest('[data-duplicate-character]'); if (duplicate) { const character = state.characters.find(item => item.id === duplicate.dataset.duplicateCharacter); if (character) { state.characters.unshift({ ...character, id:id(), name:`${character.name || 'Personaje'} (copia)`, updatedAt:Date.now() }); persist(); toast('Afiche duplicado'); } return; } const favorite = event.target.closest('[data-favorite-character]'); if (favorite) { const character = state.characters.find(item => item.id === favorite.dataset.favoriteCharacter); if (character) { character.favorite = !character.favorite; persist(); } return; } const remove = event.target.closest('[data-delete-character]'); if (remove) { const index = state.characters.findIndex(item => item.id === remove.dataset.deleteCharacter); if (index >= 0 && confirm('¿Mover este afiche a la papelera?')) { state.trash.unshift({ ...state.characters.splice(index, 1)[0], type:'characters' }); persist(); toast('Afiche enviado a la papelera'); } } });
  document.getElementById('downloadCharacter').addEventListener('click', () => { const character = state.character; if (!character) { toast('Guarda el afiche antes de descargarlo'); return; } const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 1600; const context = canvas.getContext('2d'); context.fillStyle = character.background || '#dff3ff'; context.fillRect(0, 0, canvas.width, canvas.height); context.fillStyle = character.accent || '#1768b4'; context.font = 'bold 72px Segoe UI'; context.fillText(character.name || 'Afiche TAICHI19C', 70, 110); context.font = '28px Segoe UI'; context.fillStyle = character.text || '#18325f'; context.fillText(character.nickname || 'Ficha de personaje', 70, 155); context.font = 'bold 28px Segoe UI'; context.fillText(`Ocupación: ${character.occupation || 'Por definir'}`, 70, 230); context.fillText(`Personalidad: ${character.personality || 'Por definir'}`, 70, 280); context.fillText('Descripción', 70, 980); context.font = '24px Segoe UI'; context.fillText((character.description || 'Sin descripción').slice(0, 90), 70, 1025); context.font = 'bold 28px Segoe UI'; context.fillText('Historia', 70, 1120); context.font = '24px Segoe UI'; context.fillText((character.story || 'Sin historia').slice(0, 100), 70, 1165); const link = document.createElement('a'); link.download = `${(character.name || 'afiche').replace(/\s+/g, '-').toLowerCase()}.png`; link.href = canvas.toDataURL('image/png'); link.click(); toast('Afiche descargado'); });
  document.getElementById('printCharacter')?.addEventListener('click', () => { if (!state.character) { toast('Guarda el afiche antes de exportarlo'); return; } window.print(); });
  document.getElementById('projectSearch').addEventListener('keydown', event => event.stopPropagation());
  renderVisualModules();
  window.addEventListener('hashchange', () => routeTo(window.location.hash, false));
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();
  setTheme(localStorage.getItem('taichi_theme') === 'dark'); renderAll(); routeTo(window.location.hash || '#inicio', false);
})();

(function(){
  const profileName = document.getElementById('profileName');
  const profileBio = document.getElementById('profileBio');
  const profileInsta = document.getElementById('profileInsta');
  const profileGit = document.getElementById('profileGit');
  const profileEmail = document.getElementById('profileEmail');
  const saveProfile = document.getElementById('saveProfile');
  const cancelProfile = document.getElementById('cancelProfile');
  const profilePanel = document.getElementById('profileEditor');

  function loadProfile(){
    const p = JSON.parse(localStorage.getItem('taichi_profile') || '{}');
    profileName.value = p.name || '';
    profileBio.value = p.bio || '';
    profileInsta.value = p.insta || '';
    profileGit.value = p.git || '';
    profileEmail.value = p.email || '';
    applyProfileToPage(p);
  }

  function applyProfileToPage(p){
    if (!p) p = JSON.parse(localStorage.getItem('taichi_profile') || '{}');
    if (p.name) document.querySelector('.pixel-title').textContent = p.name;
    if (p.bio) document.querySelector('.hero-copy p').textContent = p.bio;
    if (p.insta) {
      const el = document.getElementById('linkInstagram');
      el.querySelector('span').textContent = p.insta;
      el.href = 'https://instagram.com/' + p.insta.replace(/^@/, '');
    }
    if (p.git) {
      const el = document.getElementById('linkGitHub');
      el.querySelector('span').textContent = p.git;
      el.href = p.git.includes('http') ? p.git : 'https://github.com/' + p.git;
    }
    if (p.email) {
      const el = document.getElementById('linkEmail');
      el.querySelector('span').textContent = p.email;
      el.href = 'mailto:' + p.email;
    }
  }

  saveProfile.addEventListener('click', () => {
    const p = {
      name: profileName.value.trim() || 'Portafolio',
      bio: profileBio.value.trim() || '',
      insta: profileInsta.value.trim() || '',
      git: profileGit.value.trim() || '',
      email: profileEmail.value.trim() || ''
    };
    localStorage.setItem('taichi_profile', JSON.stringify(p));
    applyProfileToPage(p);
    alert('Perfil guardado localmente');
  });

  cancelProfile.addEventListener('click', () => {
    profilePanel.style.display = 'none';
  });

  loadProfile();
})();

(function(){
  const editModal = document.getElementById('editModal');
  const editFields = document.getElementById('editFields');
  const saveEdit = document.getElementById('saveEdit');
  const cancelEdit = document.getElementById('cancelEdit');
  let currentEdit = null;
  let pageEdits = JSON.parse(localStorage.getItem('taichi_page_edits') || '{}');

  function savePageEdits(){ localStorage.setItem('taichi_page_edits', JSON.stringify(pageEdits)); }
  function editStorageKey(type, index){ return index != null ? `${type}_${index}` : type; }

  function applySavedEdits(){
    Object.entries(pageEdits).forEach(([key, values]) => {
      const [type, idx] = key.split('_');
      const selector = idx != null ? `[data-edit-type="${type}"][data-edit-index="${idx}"]` : `[data-edit-type="${type}"]`;
      const element = document.querySelector(selector);
      if (!element) return;
      const config = sectionConfig[type];
      if (!config) return;
      Object.entries(values).forEach(([name, value]) => {
        const field = config.find(item => item.name === name);
        if (!field) return;
        const target = element.querySelector(field.selector);
        if (!target) return;
        if (field.name === 'chips') {
          const chipRow = element.querySelector('.chip-row');
          if (chipRow) {
            chipRow.innerHTML = '';
            value.split(',').map(t => t.trim()).filter(Boolean).forEach(text => {
              const chip = document.createElement('span');
              chip.className = 'chip';
              chip.textContent = text;
              chipRow.appendChild(chip);
            });
          }
          return;
        }
        if (field.name === 'list') {
          const ul = element.querySelector('ul');
          if (ul) {
            ul.innerHTML = '';
            value.split('\n').map(line => line.trim()).filter(Boolean).forEach(line => {
              const li = document.createElement('li');
              li.textContent = line;
              ul.appendChild(li);
            });
          }
          return;
        }
        if (target.tagName === 'IMG') {
          target.src = value; target.dataset.src = value; return;
        }
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          target.value = value; return;
        }
        target.textContent = value;
        if (field.name === 'email') {
          const link = document.getElementById('linkEmail');
          if (link) link.href = 'mailto:' + value;
        }
        if (field.name === 'instagram') {
          const link = document.getElementById('linkInstagram');
          if (link) link.href = 'https://instagram.com/' + value.replace(/^@/, '');
        }
        if (field.name === 'github') {
          const link = document.getElementById('linkGitHub');
          if (link) link.href = value.includes('http') ? value : 'https://github.com/' + value;
        }
      });
    });
  }

  const sectionConfig = {
    hero: [
      {name:'eyebrow', label:'Texto superior', type:'text', selector:'.eyebrow'},
      {name:'title', label:'Título principal', type:'text', selector:'h1.pixel-title'},
      {name:'subtitle', label:'Subtítulo', type:'text', selector:'h2.pixel-title'},
      {name:'description', label:'Descripción', type:'textarea', selector:'.hero-copy p'},
      {name:'button1', label:'Texto botón 1', type:'text', selector:'.btn-row .btn:nth-child(1)'},
      {name:'button2', label:'Texto botón 2', type:'text', selector:'.btn-row .btn:nth-child(2)'},
      {name:'chips', label:'Chips (separados por coma)', type:'text', selector:'.chip-row'},
      {name:'heroImage', label:'URL imagen hero', type:'text', selector:'.hero-art img'}
    ],
    about: [
      {name:'title', label:'Título sección', type:'text', selector:'.section-head h2'},
      {name:'tag', label:'Etiqueta', type:'text', selector:'.section-head .chip'},
      {name:'description', label:'Descripción principal', type:'textarea', selector:'.about-grid .card p'},
      {name:'aboutImage', label:'URL imagen Sobre mí', type:'text', selector:'.illustration-card img'},
      {name:'list', label:'Lista de puntos (línea por punto)', type:'textarea', selector:'.about-grid .card ul'}
    ],
    projects: [
      {name:'title', label:'Título sección', type:'text', selector:'.section-head h2'},
      {name:'subtitle', label:'Subtítulo', type:'text', selector:'.section-head .chip'}
    ],
    project: [
      {name:'badge', label:'Etiqueta del proyecto', type:'text', selector:'.badge'},
      {name:'title', label:'Título del proyecto', type:'text', selector:'h3'},
      {name:'description', label:'Descripción del proyecto', type:'textarea', selector:'p'},
      {name:'image', label:'URL de la imagen', type:'text', selector:'img'}
    ],
    contact: [
      {name:'title', label:'Título sección', type:'text', selector:'.section-head h2'},
      {name:'subtitle', label:'Subtítulo', type:'text', selector:'.section-head .chip'},
      {name:'instagram', label:'Instagram', type:'text', selector:'#linkInstagram span'},
      {name:'github', label:'GitHub', type:'text', selector:'#linkGitHub span'},
      {name:'email', label:'Email', type:'text', selector:'#linkEmail span'}
    ]
  };

  function buildField(cfg, value = ''){
    const wrapper = document.createElement('div'); wrapper.className = 'edit-field';
    const label = document.createElement('label'); label.textContent = cfg.label;
    const input = cfg.type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
    if (cfg.type !== 'textarea') input.type = cfg.type;
    input.name = cfg.name;
    input.value = value;
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    if (cfg.type === 'textarea') input.style.minHeight = '100px';
    return wrapper;
  }

  function openEditModal(type, element, index){
    currentEdit = { type, element, index };
    editFields.innerHTML = '';
    const config = sectionConfig[type];
    if (!config) return;
    config.forEach(field => {
      let value = '';
      const target = element.querySelector(field.selector);
      if (target) {
        if (field.type === 'textarea') {
          if (target.tagName === 'UL') value = Array.from(target.querySelectorAll('li')).map(li => li.textContent).join('\n');
          else value = target.textContent;
        } else {
          value = target.textContent || target.value || target.src || '';
        }
      }
      editFields.appendChild(buildField(field, value));
    });
    editModal.classList.add('show');
  }

  function closeEditModal(){ currentEdit = null; editFields.innerHTML = ''; editModal.classList.remove('show'); }

  function saveEditValues(){
    if (!currentEdit) return;
    const fields = Array.from(editFields.querySelectorAll('[name]'));
    fields.forEach(input => {
      const cfg = sectionConfig[currentEdit.type].find(item => item.name === input.name);
      if (!cfg) return;
      const target = currentEdit.element.querySelector(cfg.selector);
      if (!target) return;
      let value = input.value;
      if (cfg.name === 'chips') {
        const chipRow = currentEdit.element.querySelector('.chip-row');
        if (chipRow) {
          chipRow.innerHTML = '';
          value.split(',').map(t => t.trim()).filter(Boolean).forEach(text => {
            const chip = document.createElement('span');
            chip.className = 'chip';
            chip.textContent = text;
            chipRow.appendChild(chip);
          });
        }
        pageEdits[editStorageKey(currentEdit.type, currentEdit.index)] = pageEdits[editStorageKey(currentEdit.type, currentEdit.index)] || {};
        pageEdits[editStorageKey(currentEdit.type, currentEdit.index)][input.name] = value;
        savePageEdits();
        return;
      }
      if (cfg.name === 'list') {
        const ul = currentEdit.element.querySelector('ul');
        if (ul) {
          ul.innerHTML = '';
          value.split('\n').map(line => line.trim()).filter(Boolean).forEach(line => {
            const li = document.createElement('li');
            li.textContent = line;
            ul.appendChild(li);
          });
        }
        pageEdits[editStorageKey(currentEdit.type, currentEdit.index)] = pageEdits[editStorageKey(currentEdit.type, currentEdit.index)] || {};
        pageEdits[editStorageKey(currentEdit.type, currentEdit.index)][input.name] = value;
        savePageEdits();
        return;
      }
      if (target.tagName === 'IMG') {
        target.src = value;
        target.dataset.src = value;
        pageEdits[editStorageKey(currentEdit.type, currentEdit.index)] = pageEdits[editStorageKey(currentEdit.type, currentEdit.index)] || {};
        pageEdits[editStorageKey(currentEdit.type, currentEdit.index)][input.name] = value;
        savePageEdits();
        return;
      }
      if (cfg.type === 'text' || cfg.type === 'textarea') {
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          target.value = value;
        } else {
          target.textContent = value;
        }
        pageEdits[editStorageKey(currentEdit.type, currentEdit.index)] = pageEdits[editStorageKey(currentEdit.type, currentEdit.index)] || {};
        pageEdits[editStorageKey(currentEdit.type, currentEdit.index)][input.name] = value;
        savePageEdits();
        if (cfg.name === 'email') {
          const link = document.getElementById('linkEmail');
          if (link) link.href = 'mailto:' + value;
        }
        if (cfg.name === 'instagram') {
          const link = document.getElementById('linkInstagram');
          if (link) link.href = 'https://instagram.com/' + value.replace(/^@/, '');
        }
        if (cfg.name === 'github') {
          const link = document.getElementById('linkGitHub');
          if (link) link.href = value.includes('http') ? value : 'https://github.com/' + value;
        }
      }
    });
    closeEditModal();
  }

  function isAdmin(){
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === 'true' || params.get('modo') === 'admin';
    } catch (e) {
      return false;
    }
  }

  function attachEditBadges(){
    if (!isAdmin()) return;
    const editable = document.querySelectorAll('[data-edit-type]');
    editable.forEach(el => {
      if (el.querySelector(':scope > .edit-badge')) return;
      const badge = document.createElement('div');
      badge.className = 'edit-badge';
      badge.textContent = '✏️';
      badge.title = 'Editar contenido';
      badge.addEventListener('click', () => openEditModal(el.dataset.editType, el, el.dataset.editIndex));
      if (!el.style.position) el.style.position = 'relative';
      el.appendChild(badge);
    });
  }

  applySavedEdits();
  attachEditBadges();
  saveEdit.addEventListener('click', saveEditValues);
  cancelEdit.addEventListener('click', closeEditModal);
  editModal.addEventListener('click', (event) => {
    if (event.target === editModal) closeEditModal();
  });

    /* ===== Ficha de personaje: galería, stickers, visor y exportación ===== */
  function readFileAsDataURL(file) { return new Promise(function (resolve) { const r = new FileReader(); r.onload = function () { resolve(r.result); }; r.readAsDataURL(file); }); }
  function commitCharacterDraft(extra) {
    const draft = Object.assign({}, readCharacterDraft(), extra || {});
    const base = state.characters.find(function (i) { return i.id === editingCharacterId; }) || {};
    const next = Object.assign({}, base, draft, { id: editingCharacterId || (state.character && state.character.id) || id(), template: document.getElementById('characterTheme').value });
    if (editingCharacterId) state.characters = state.characters.map(function (i) { return i.id === editingCharacterId ? next : i; });
    state.character = next;
    persist();
    renderCharacter(next);
    renderStickerActive();
    renderGalleryThumbs();
  }
  function renderGalleryThumbs() {
    const box = document.getElementById('characterGalleryThumbs');
    if (!box) return;
    const gallery = (state.character && state.character.gallery) || [];
    box.innerHTML = gallery.length ? gallery.map(function (src, i) { return '<div class="character-gallery-thumb"><img src="' + src + '" alt="Foto ' + (i + 1) + '"><button type="button" data-remove-gallery="' + i + '" title="Quitar">✕</button></div>'; }).join('') : '<small style="color:var(--platform-muted)">Sin fotos extra. Puedes agregar varias.</small>';
  }
  function renderStickerActive() {
    const box = document.getElementById('stickerActive');
    if (!box) return;
    const list = (state.character && state.character.stickers) || [];
    box.innerHTML = list.length ? list.map(function (st, i) { const d = typeof st === 'string' ? { s: st } : st; return '<button type="button" data-remove-sticker="' + i + '" title="Quitar sticker">' + escapeText(d.s || '') + '</button>'; }).join('') : '<small style="color:var(--platform-muted)">Toca un sticker para ponerlo en la ficha. Toca uno puesto para quitarlo.</small>';
  }
  const STICKER_SET = ['🎀', '⭐', '💖', '✨', '☁️', '🌙', '🌸', '🐱', '🎧', '🎮', '💻', '🎨', '🍓', '🌈', '💫', '🦋'];
  const stickerPaletteEl = document.getElementById('stickerPalette');
  if (stickerPaletteEl) {
    stickerPaletteEl.innerHTML = STICKER_SET.map(function (s) { return '<button type="button" data-sticker="' + s + '">' + s + '</button>'; }).join('');
    stickerPaletteEl.addEventListener('click', function (event) {
      const btn = event.target.closest('[data-sticker]');
      if (!btn) return;
      const cur = (state.character && state.character.stickers) || [];
      const next = cur.slice();
      next.push({ s: btn.dataset.sticker, x: 8 + Math.round(Math.random() * 84), y: 8 + Math.round(Math.random() * 84) });
      commitCharacterDraft({ stickers: next });
      toast('Sticker agregado');
    });
  }
  document.addEventListener('click', function (event) {
    const rmSticker = event.target.closest('[data-remove-sticker]');
    if (rmSticker) { const i = Number(rmSticker.dataset.removeSticker); const cur = (state.character && state.character.stickers) || []; commitCharacterDraft({ stickers: cur.filter(function (_, idx) { return idx !== i; }) }); return; }
    const rmGal = event.target.closest('[data-remove-gallery]');
    if (rmGal) { const i = Number(rmGal.dataset.removeGallery); const cur = (state.character && state.character.gallery) || []; commitCharacterDraft({ gallery: cur.filter(function (_, idx) { return idx !== i; }) }); return; }
  });
  const galleryInput = document.getElementById('characterGalleryInput');
  if (galleryInput) galleryInput.addEventListener('change', function (event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    Promise.all(files.map(readFileAsDataURL)).then(function (results) {
      const cur = (state.character && state.character.gallery) || [];
      commitCharacterDraft({ gallery: cur.concat(results).slice(0, 12) });
      toast('Fotos agregadas a la galería');
    });
    event.target.value = '';
  });

  /* Visor de ficha completa */
  const fichaViewer = document.getElementById('fichaViewer');
  function openFichaViewer(character) {
    if (!character) { toast('Crea o guarda un personaje primero'); return; }
    const poster = document.getElementById('characterPoster');
    if (!poster) { return; }
    const clone = poster.cloneNode(true);
    clone.id = 'fichaViewerPoster';
    clone.classList.add('ficha-viewer-full');
    fichaViewer.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'ficha-viewer-inner';
    const bar = document.createElement('div');
    bar.className = 'ficha-viewer-bar';
    bar.innerHTML = '<strong>Ficha: ' + escapeText(character.name || 'Personaje') + '</strong><div><button class="platform-btn platform-btn-light" id="fvEdit" type="button">Editar</button><button class="platform-btn platform-btn-light" id="fvClose" type="button">✕ Cerrar</button></div>';
    wrap.appendChild(bar);
    wrap.appendChild(clone);
    fichaViewer.appendChild(wrap);
    fichaViewer.classList.add('show');
    fichaViewer.setAttribute('aria-hidden', 'false');
    setTimeout(function () {
      const fvEdit = document.getElementById('fvEdit');
      if (fvEdit) fvEdit.addEventListener('click', function () {
        fichaViewer.classList.remove('show');
        fichaViewer.setAttribute('aria-hidden', 'true');
        const ch = state.characters.find(function (i) { return i.id === character.id; }) || character;
        openCharacterEditor(ch, ch.template);
      });
      const fvClose = document.getElementById('fvClose');
      if (fvClose) fvClose.addEventListener('click', function () {
        fichaViewer.classList.remove('show');
        fichaViewer.setAttribute('aria-hidden', 'true');
      });
    }, 0);
  }
  document.getElementById('viewFichaBtn') && document.getElementById('viewFichaBtn').addEventListener('click', function () { openFichaViewer(state.character); });
  fichaViewer && fichaViewer.addEventListener('click', function (e) { if (e.target === fichaViewer) { fichaViewer.classList.remove('show'); fichaViewer.setAttribute('aria-hidden', 'true'); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && fichaViewer && fichaViewer.classList.contains('show')) { fichaViewer.classList.remove('show'); fichaViewer.setAttribute('aria-hidden', 'true'); } });

  /* Pantalla completa para editar */
  const fullscreenBtn = document.getElementById('characterFullscreenBtn');
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', function () {
    const on = document.body.classList.toggle('character-fullscreen');
    fullscreenBtn.textContent = on ? '⛶ Salir de pantalla completa' : '⛶ A pantalla completa';
    if (on) window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* Exportar con imagen real (PNG y JPG) */
  function loadImage(src) { return new Promise(function (resolve, reject) { const img = new Image(); img.onload = function () { resolve(img); }; img.onerror = reject; img.src = src; }); }
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function drawCover(ctx, img, x, y, w, h) { const ir = img.width / img.height, br = w / h; let sx = 0, sy = 0, sw = img.width, sh = img.height; if (ir > br) { sw = img.height * br; sx = (img.width - sw) / 2; } else { sh = img.width / br; sy = (img.height - sh) / 2; } ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h); }
  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = String(text || '').split(' '); let line = ''; let lines = 0;
    for (let n = 0; n < words.length; n++) { const test = line + words[n] + ' '; if (ctx.measureText(test).width > maxWidth && n > 0) { ctx.fillText(line, x, y); line = words[n] + ' '; y += lineHeight; lines++; if (maxLines && lines >= maxLines) { ctx.fillText('…', x, y - lineHeight); return y; } } else { line = test; } }
    ctx.fillText(line, x, y); return y + lineHeight;
  }
  async function exportCharacterPoster(format) {
    const character = state.character;
    if (!character) { toast('Crea o guarda un personaje primero'); return; }
    toast('Generando imagen…');
    const W = 1000, PAD = 56;
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
    ctx.font = '28px Segoe UI, Arial';
    const hasImage = !!character.image;
    let img = null; if (hasImage) { try { img = await loadImage(character.image); } catch (e) { img = null; } }
    // Calculamos alto dinamico segun contenido
    const infoPairs = [['Edad', character.age], ['Género', character.gender], ['Ocupación', character.occupation], ['Rol', character.role], ['Personalidad', character.personality]];
    const detailSections = [['Descripción', character.description], ['Historia', character.story], ['Fortalezas', character.strengths], ['Objetivos', character.goals]].filter(function (s) { return s[1]; });
    const bodyTop = 250;
    const infoH = Math.ceil(infoPairs.length / 2) * 66 + 40;
    const detailsH = detailSections.reduce(function (acc, s) { ctx.font = '24px Segoe UI'; const lines = Math.ceil(ctx.measureText(s[1]).width / (W - PAD * 2)) + 1; return acc + 44 + lines * 32; }, 24);
    let H = bodyTop + (img ? Math.max(img.height > 0 ? 0 : 0, 0) : 0);
    const portraitH = img ? Math.min(520, Math.max(320, img.height)) : 0;
    const contentBottom = detailSections.length ? bodyTop + Math.max(infoH, portraitH) + detailsH + 60 : bodyTop + Math.max(infoH, portraitH) + 40;
    H = Math.max(1200, contentBottom);
    canvas.width = W; canvas.height = H;
    // Fondo
    ctx.fillStyle = character.background || '#dff3ff'; ctx.fillRect(0, 0, W, H);
    const accent = character.accent || '#1768b4'; const textColor = character.text || '#18325f';
    // Stickers
    (character.stickers || []).forEach(function (st) { const d = typeof st === 'string' ? { s: st, x: 12, y: 12 } : st; ctx.font = '52px Segoe UI Emoji, Segoe UI'; ctx.fillText(d.s || '', (d.x ?? 12) / 100 * W, (d.y ?? 12) / 100 * H); });
    // Cabecera
    ctx.fillStyle = accent; ctx.font = 'bold 24px Segoe UI'; ctx.fillText(String(character.role || 'FICHA DE PERSONAJE').toUpperCase(), PAD, PAD + 30);
    ctx.font = 'bold 60px Segoe UI'; ctx.fillStyle = textColor; ctx.fillText(character.name || 'Personaje sin nombre', PAD, PAD + 100);
    if (character.nickname) { ctx.font = 'italic 26px Segoe UI'; ctx.fillStyle = accent; ctx.fillText('“' + character.nickname + '”', PAD, PAD + 140); }
    // Cuerpo
    let y = bodyTop;
    if (img) { const pw = 340; ctx.save(); ctx.strokeStyle = accent; ctx.lineWidth = 8; ctx.fillStyle = 'rgba(255,255,255,.6)'; roundRect(ctx, PAD, y, pw, portraitH, 16); ctx.fill(); ctx.clip(); drawCover(ctx, img, PAD, y, pw, portraitH); ctx.restore(); ctx.strokeStyle = accent; ctx.lineWidth = 8; roundRect(ctx, PAD, y, pw, portraitH, 16); ctx.stroke(); }
    const infoX = img ? PAD + 380 : PAD; const infoW = img ? (W - PAD - (PAD + 380)) : (W - PAD * 2);
    ctx.font = '20px Segoe UI'; let iy = y + 24;
    infoPairs.forEach(function (p) { if (!p[1]) return; ctx.fillStyle = accent; ctx.font = 'bold 18px Segoe UI'; ctx.fillText(p[0], infoX, iy); ctx.fillStyle = textColor; ctx.font = '24px Segoe UI'; ctx.fillText(String(p[1]).slice(0, 34), infoX, iy + 30); iy += 70; if (iy > y + portraitH - 40 && img) { return; } });
    // Detalles
    let dy = y + (img ? portraitH : infoH) + 46;
    detailSections.forEach(function (s) { ctx.fillStyle = accent; ctx.font = 'bold 26px Segoe UI'; ctx.fillText(s[0], PAD, dy); dy += 34; ctx.fillStyle = textColor; ctx.font = '22px Segoe UI'; dy = wrapText(ctx, s[1], PAD, dy, W - PAD * 2, 30, 6) + 26; });
    // Pie
    ctx.fillStyle = accent; ctx.font = '18px Segoe UI'; ctx.fillText('TAICHI19C · Ficha de personaje', PAD, H - 30);
    const link = document.createElement('a');
    link.download = (character.name || 'ficha').replace(/\s+/g, '-').toLowerCase() + '.' + (format === 'jpg' ? 'jpg' : 'png');
    link.href = format === 'jpg' ? canvas.toDataURL('image/jpeg', 0.92) : canvas.toDataURL('image/png');
    link.click();
    toast('Ficha descargada');
  }
  document.getElementById('downloadCharacter').addEventListener('click', function () { exportCharacterPoster('png'); });
  const jpgBtn = document.getElementById('downloadCharacterJpg');
  if (jpgBtn) jpgBtn.addEventListener('click', function () { exportCharacterPoster('jpg'); });
  renderGalleryThumbs(); renderStickerActive();

})();
