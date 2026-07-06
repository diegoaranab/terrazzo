        // run cb only when Flickity is available; safe to call multiple times
        function onFlickityReady(cb){
            if (window.Flickity) { cb(); return; }
            window.addEventListener('load', cb, { once: true });
        }

        /* ===== Promo ticker: duplicate & pause on hover ===== */
        const track = document.querySelector('.ticker-track');
        track.innerHTML += track.innerHTML;          // clone for seamless loop

        document.querySelector('.ticker').addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        document.querySelector('.ticker').addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });



        /* ======== Dynamic menu rendering ======== */
        const menuURL = '/terrazzo/assets/menu.json';
        const menuGrid = document.getElementById('menu-grid');

        /* ===== Cart (Carrito) state & helpers ===== */
        const PHONE_WA = '522381897602'; // MX +52 238 189 7602 for wa.me
        const CART_KEY = 'terrazzo_cart_v1';

        let CART = loadCart();

        function loadCart(){
          try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
          catch(e){ return []; }
        }
        function saveCart(){
          localStorage.setItem(CART_KEY, JSON.stringify(CART));
          renderCart();
        }
        function findItem(id){ return CART.find(i => i.id === id); }

        function addToCart(item, qty=1){
          const existing = findItem(item.id);
          if(existing){ existing.qty += qty; }
          else { CART.push({...item, qty}); }
          saveCart();
        }
        function removeFromCart(id){
          CART = CART.filter(i => i.id !== id);
          saveCart();
        }
        function updateQty(id, qty){
          const it = findItem(id);
          if(!it) return;
          it.qty = Math.max(1, qty|0);
          saveCart();
        }
        function clearCart(){
          CART = []; saveCart();
        }

        function cartTotals(){
          const items = CART.reduce((a,i)=>a+i.qty,0);
          const total = CART.reduce((a,i)=>a + i.qty * (Number(i.price)||0), 0);
          return {items, total};
        }
        function formatCurrency(n){ return 'MX$ ' + (Number(n)||0).toLocaleString('es-MX'); }
        function generateOrderCode(){
          return `TER-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        function buildWhatsAppMessage(orderCode){
          const { total } = cartTotals();
          const lines = CART.map(it => {
            const price = Number(it.price) || 0;
            const subtotal = it.qty * price;
            return `• ${it.qty} × ${it.name} — ${formatCurrency(price)} c/u = ${formatCurrency(subtotal)}`;
          }).join('\n');

          return [
            'Hola, quiero hacer un pedido en Terrazzo.',
            '',
            `Código de pedido: ${orderCode}`,
            '',
            'Pedido:',
            lines,
            '',
            `Total estimado: ${formatCurrency(total)}`,
            'Forma de pago: Transferencia',
            '',
            'Entiendo que el total final se confirma por WhatsApp y que el pedido inicia cuando se confirme la transferencia.',
            '',
            'Envío este pedido desde el sitio web de Terrazzo.'
          ].join('\n');
        }

        // fetch(menuURL)
        //     .then(res => res.json())
        //     .then(data => {
        //         buildCards(data); // inject all items
        //         initFilters();    // then hide/show by default
        //     })
        //     .catch(err => console.error('Menu JSON load error:', err)); 


        function buildCards(items) {
            items.forEach(item => {
                const col = document.createElement('div');
                col.className = 'col-sm-6 col-lg-4 menu-item carousel-cell';
                col.dataset.category = item.category;

                col.innerHTML = `
  <div class="card menu-card h-100 my-2">
    <div class="ratio ratio-4x3">
      <img src="${item.img}" class="card-img-top object-fit-cover" alt="${item.name}">
    </div>
    <div class="card-body">
      <h3 class="h5 card-title">${item.name}</h3>
      <p class="card-text small">${item.description}</p>
    </div>
    <div class="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center">
      <span class="fw-bold">${formatCurrency(item.price)}</span>
      <button class="btn btn-cta btn-sm btn-add-cart"
        data-id="${item.id || item.name}"
        data-name="${item.name}"
        data-price="${item.price}"
        data-img="${item.img}">Añadir</button>
    </div>
  </div>`;

                menuGrid.appendChild(col);
            });
        }

        /* Add-to-cart (delegated) */
        menuGrid.addEventListener('click', (e) => {
          const btn = e.target.closest('.btn-add-cart');
          if(!btn) return;
          const item = {
            id: btn.dataset.id,
            name: btn.dataset.name,
            price: Number(btn.dataset.price),
            img: btn.dataset.img
          };
          addToCart(item, 1);
        });

        /* Render cart UI into offcanvas */
        const cartCountEl = document.getElementById('cartCount');
        const cartLinesEl = document.getElementById('cartLines');
        const cartTotalEl = document.getElementById('cartTotal');
        const checkoutBtn  = document.getElementById('checkoutBtn');
        const cartDrawerEl = document.getElementById('cartDrawer');

        if(cartDrawerEl){
          cartDrawerEl.addEventListener('show.bs.offcanvas', () => {
            document.body.classList.add('cart-drawer-open');
          });
          cartDrawerEl.addEventListener('hidden.bs.offcanvas', () => {
            document.body.classList.remove('cart-drawer-open');
          });
        }

        function renderCart(){
          const {items, total} = cartTotals();
          if(cartCountEl) cartCountEl.textContent = items;

          cartLinesEl.innerHTML = '';
          if(CART.length === 0){
            cartLinesEl.innerHTML = '<p class="text-muted mb-0">Tu carrito está vacío.</p>';
          } else {
            CART.forEach(it => {
              const line = document.createElement('div');
              line.className = 'cart-line';
              line.innerHTML = `
        <div>
          <div class="cart-line-title">${it.name}</div>
          <div class="text-muted small">${formatCurrency(it.price)} c/u</div>
        </div>
        <div class="cart-qty-wrap">
          <button class="qty-btn btn-dec" data-id="${it.id}" aria-label="Disminuir cantidad">−</button>
          <input class="form-control form-control-sm text-center" style="width:3.25rem" type="number" min="1" value="${it.qty}" data-id="${it.id}">
          <button class="qty-btn btn-inc" data-id="${it.id}" aria-label="Aumentar cantidad">+</button>
          <button class="btn btn-sm btn-outline-light ms-2 btn-remove" data-id="${it.id}">Quitar</button>
        </div>`;
              cartLinesEl.appendChild(line);
            });
          }
          cartTotalEl.textContent = formatCurrency(total);
        }

        /* quantity & remove (delegated) */
        cartLinesEl.addEventListener('click', (e)=>{
          const dec = e.target.closest('.btn-dec');
          const inc = e.target.closest('.btn-inc');
          const rem = e.target.closest('.btn-remove');
          if(dec){ updateQty(dec.dataset.id, (findItem(dec.dataset.id)?.qty||1) - 1); }
          if(inc){ updateQty(inc.dataset.id, (findItem(inc.dataset.id)?.qty||1) + 1); }
          if(rem){ removeFromCart(rem.dataset.id); }
        });
        cartLinesEl.addEventListener('change', (e)=>{
          const inp = e.target.closest('input[type="number"][data-id]');
          if(!inp) return;
          updateQty(inp.dataset.id, Number(inp.value||1));
        });

        /* Checkout to WhatsApp (Spanish message) */
        checkoutBtn.addEventListener('click', ()=>{
          if(CART.length === 0) return;
          const message = buildWhatsAppMessage(generateOrderCode());
          const url = `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(message)}`;
          // Clear cart immediately so it resets even if user returns
          clearCart();
          // go to WhatsApp
          window.location.href = url;
        });

        /* initial paint */
        renderCart();

        /* ===== Menu Filtering ===== */
        function initFilters() {
            const btns = document.querySelectorAll('[data-filter]');
            const cards = () => document.querySelectorAll('.menu-item'); // fresh each time

            function applyFilter(filter) {
                const cardsList = cards();               // fresh NodeList each call

                /* 1 – show only the wanted category & keep the Flickity cell class on visibles */
                cardsList.forEach(card => {
                    const visible = card.dataset.category === filter;
                    card.style.display = visible ? 'block' : 'none';
                    card.classList.toggle('carousel-cell', visible);
                });

                /* 2 – re-create Flickity so the slide list & page-dots are recalculated */
                if (menuGrid.flickityInstance) {
                    menuGrid.flickityInstance.destroy();
                    menuGrid.flickityInstance = null;
                }
                syncCarousels();                         // will build a fresh slider if we are on mobile
                equaliseCardHeights(menuGrid);

            }



            // wire click handlers
            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    btns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    applyFilter(btn.dataset.filter);
                });
            });

            // default view = Hamburguesas
            applyFilter('hamburguesas');
        }

        /* ======== Dynamic events rendering ======== */
        const eventsURL = '/terrazzo/assets/events.json';
        const eventGrid = document.getElementById('event-grid');

        // fetch(eventsURL)
        //     .then(res => res.json())
        //     .then(events => buildEventCards(events))
        //     .catch(err => console.error('Events JSON load error:', err));

        function buildEventCards(events) {
            events.forEach(ev => {
                const col = document.createElement('div');
                col.className = 'col-md-4 carousel-cell';
                col.innerHTML = `
  <div class="card menu-card h-100 my-2">
    <div class="ratio ratio-4x3">
      <img src="${ev.img}" class="card-img-top object-fit-cover" alt="${ev.title}">
    </div>
    <div class="card-body">
      <h3 class="h5 card-title">${ev.title}</h3>
      <p class="small mb-1"><i class="bi bi-calendar-event me-1"></i>${ev.date}</p>
      <p class="card-text small">${ev.description}</p>
    </div>
    <div class="card-footer bg-transparent border-0 text-end">
      <a href="https://wa.me/${PHONE_WA}?text=Quiero%20reservar%20para%20${encodeURIComponent(ev.title)}"
         class="btn btn-cta btn-sm">Reservar&nbsp;ya</a>
    </div>
  </div>`;

                eventGrid.appendChild(col);
            });
            // after appending all event cards:
            onFlickityReady(() => {
                syncCarousels();                 // ensure Eventos gets initialized on first load
                if (window.matchMedia('(max-width: 767.98px)').matches) {
                    equaliseCardHeights(eventGrid);
                }
            });

        }







        /* ────────────────────────────────────────────────────────── */
        /* measure all visible cards in a grid and force them to  */
        /* match the tallest one                                   */
        /* ────────────────────────────────────────────────────────── */
        function equaliseCardHeights(grid) {
            const cards = grid.querySelectorAll('.carousel-cell .menu-card');
            if (!cards.length) return;

            let max = 0;
            cards.forEach(c => {
                c.style.height = '';               // reset
                max = Math.max(max, c.offsetHeight);
            });
            cards.forEach(c => c.style.height = max + 'px');

            if (grid.flickityInstance) grid.flickityInstance.resize();
        }


        function syncCarousels() {
            if (!window.Flickity) return; // library not ready yet

            const isMobile = window.matchMedia('(max-width: 767.98px)').matches;

            [menuGrid, eventGrid].forEach(grid => {
                if (!grid) return;

                // Enable Flickity on mobile
                if (isMobile && !grid.flickityInstance) {
                    const flkty = new Flickity(grid, {
                        cellSelector: '.carousel-cell',
                        cellAlign: 'center',
                        contain: true,
                        imagesLoaded: true,
                        draggable: true,
                        prevNextButtons: false,
                        pageDots: true
                    });
                    grid.flickityInstance = flkty;
                    flkty.select(0, false, true);

                    // Keep card heights tidy after Flickity settles
                    flkty.once('ready', () => equaliseCardHeights(grid));
                    flkty.on('settle', () => equaliseCardHeights(grid));
                }

                // Destroy on tablet/desktop so Bootstrap grid returns
                if (!isMobile && grid.flickityInstance) {
                    grid.flickityInstance.destroy();
                    grid.flickityInstance = null;
                }
            });
        }




        Promise.allSettled([
            fetch(menuURL).then(r => r.json()).then(data => {
                buildCards(data); initFilters();
            }),
            fetch(eventsURL).then(r => r.json()).then(ev => {
                buildEventCards(ev);
            })
        ]).then(() => {
            onFlickityReady(syncCarousels);      // init both grids as carousels on mobile
            // final pass after images load
            window.addEventListener('load', () => {
                equaliseCardHeights(menuGrid);
                equaliseCardHeights(eventGrid);
            });
        });

        window.addEventListener('resize', debounce(() => {
            onFlickityReady(syncCarousels);
        }, 150));

        /* tiny debounce helper */
        function debounce(fn, wait) {
            let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
        }

        // ===== Build Gallery slides and init Flickity + GLightbox =====
        function initGalleryCarousel(){
            const container = document.getElementById('gallery-carousel');
            if (!container) return;

            fetch('/terrazzo/assets/gallery.json')
                .then(res => {
                    if (!res.ok) throw new Error(`Gallery JSON load failed: ${res.status}`);
                    return res.json();
                })
                .then(items => {
                    container.innerHTML = items.map((item, idx) => `
  <div class="carousel-cell">
    <a href="${item.src}" class="glightbox" data-gallery="terrazzo" aria-label="Abrir imagen ${idx+1} de ${items.length}">
      <div class="carousel-frame">
        <img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async">
      </div>
    </a>
  </div>
`).join('');

                    // IMPORTANT: re-bind GLightbox now that slides exist
                    if (window.galleryLightbox) { window.galleryLightbox.destroy(); }
                    window.galleryLightbox = GLightbox({ selector: '.glightbox' });

                    const flkty = new Flickity(container, {
                        cellSelector: '.carousel-cell',
                        cellAlign: 'center',
                        contain: true,
                        wrapAround: true,
                        imagesLoaded: true,
                        pageDots: true,
                        prevNextButtons: true,
                        draggable: true,
                        groupCells: function(width){
                            if (width < 576) return 1;   // mobile
                            if (width < 992) return 2;   // tablet
                            return 3;                    // desktop+
                        }
                    });
                    flkty.resize(); // ensure correct height on first paint

                    // hide arrows on very small screens, keep dots
                    const mqSmall = window.matchMedia('(max-width: 575.98px)');
                    function toggleArrows(e){ flkty.options.prevNextButtons = !e.matches; flkty.resize(); }
                    mqSmall.addEventListener ? mqSmall.addEventListener('change', toggleArrows) : mqSmall.addListener(toggleArrows);
                    toggleArrows(mqSmall);
                })
                .catch(err => console.error('Gallery JSON load error:', err));

        }

        onFlickityReady(initGalleryCarousel);
